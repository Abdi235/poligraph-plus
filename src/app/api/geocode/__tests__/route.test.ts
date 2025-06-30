import { GET } from '../route'; // Adjust path as necessary
import { NextRequest } from 'next/server';
import { URL } from 'url'; // Import URL for creating NextURL

// Mock the global fetch
global.fetch = jest.fn();

// Helper to create a mock NextRequest
function mockNextRequest(searchParams: Record<string, string>): NextRequest {
  const url = new URL('http://localhost/api/geocode');
  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return new NextRequest(url.toString());
}

describe('/api/geocode GET handler', () => {
  beforeEach(() => {
    // Reset fetch mock and any cache inside the module if possible
    // For the simple in-memory cache in route.ts, we can't easily reset it from outside
    // without modifying the route code for testability (e.g., exporting a resetCache function).
    // For these tests, we'll rely on different query params for cache misses or test cache behavior explicitly.
    (fetch as jest.Mock).mockClear();
    // Manually clear the cache if it were exported or modifiable, e.g.:
    // import { geocodeCache } from '../route'; geocodeCache.clear();
    // Since it's not exported, tests might interfere if using same keys. We'll use unique keys.
  });

  it('should return 400 if query parameter "q" is missing', async () => {
    const req = mockNextRequest({});
    const response = await GET(req);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('query parameter "q" is required');
  });

  it('should return geocoded data from Nominatim on cache miss', async () => {
    const mockNominatimResponse = [{
      lat: '51.5074',
      lon: '0.1278',
      display_name: 'London, UK',
    }];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockNominatimResponse,
    });

    const req = mockNextRequest({ q: 'London' });
    const response = await GET(req);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.latitude).toBe(51.5074);
    expect(body.longitude).toBe(0.1278);
    expect(body.displayName).toBe('London, UK');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent('London')),
      expect.any(Object)
    );
  });

  it('should return cached data on subsequent identical requests', async () => {
    const mockNominatimResponse = [{
      lat: '40.7128',
      lon: '-74.0060',
      display_name: 'New York, USA',
    }];
    (fetch as jest.Mock).mockResolvedValueOnce({ // For the first call (cache miss)
      ok: true,
      json: async () => mockNominatimResponse,
    });

    const req1 = mockNextRequest({ q: 'NewYorkTestCache' }); // Unique query for this test
    await GET(req1); // Populate cache
    expect(fetch).toHaveBeenCalledTimes(1);

    // Subsequent call - should hit cache
    const req2 = mockNextRequest({ q: 'NewYorkTestCache' });
    const response2 = await GET(req2);
    expect(response2.status).toBe(200);
    const body2 = await response2.json();
    expect(body2.displayName).toBe('New York, USA');
    expect(fetch).toHaveBeenCalledTimes(1); // Fetch should NOT be called again
  });

  it('should return 404 if Nominatim returns empty results', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [], // Empty array for no results
    });
    const req = mockNextRequest({ q: 'InvalidLocationQueryFor404' });
    const response = await GET(req);
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error).toContain('Location not found by geocoding service');
  });

  it('should return 500 if Nominatim call fails', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 503,
      text: async () => 'Service Unavailable',
    });
    const req = mockNextRequest({ q: 'QueryCausingError' });
    const response = await GET(req);
    // The status code from Nominatim should be propagated if possible, or a generic server error
    // Based on current implementation, it might return the Nominatim status.
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.error).toContain('Failed to fetch from geocoding service');
  });
});
