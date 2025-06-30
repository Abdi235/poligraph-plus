// src/app/__tests__/HomePageIntegration.test.tsx
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Home from '../page';
import { TopicProvider } from '@/context/TopicContext';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock child components that are complex or have side effects (like Leaflet map)
jest.mock('@/components/DynamicMap', () => {
  return jest.fn(({ data }) => <div data-testid="dynamic-map-mock">{`Map Points: ${data ? data.length : 0}`}</div>);
});

jest.mock('@/components/TrendBoard', () => {
  return jest.fn(() => <div data-testid="trend-board-mock">Trend Board</div>);
});

jest.mock('@/components/TimelineSlider', () => {
  return jest.fn(() => <div data-testid="timeline-slider-mock">Timeline Slider</div>);
});


// Mock ML services to return predictable results quickly and avoid model loading in tests
jest.mock('@/services/sentimentAnalysis', () => ({
    getInstance: jest.fn().mockReturnValue({
        analyze: jest.fn().mockResolvedValue([{ label: 'POSITIVE', score: 0.8 }])
    })
}));
jest.mock('@/services/keywordExtraction', () => ({
    getInstance: jest.fn().mockReturnValue({
        extract: jest.fn().mockResolvedValue(['test', 'keyword'])
    })
}));
jest.mock('@/services/eventClassification', () => ({
    getInstance: jest.fn().mockReturnValue({
        classify: jest.fn().mockResolvedValue('General')
    })
}));
jest.mock('@/services/spikeAlertService', () => ({
    getInstance: jest.fn().mockReturnValue({
        checkForSpike: jest.fn().mockReturnValue(null), // No spikes by default in tests
        getHistory: jest.fn().mockReturnValue([])
    })
}));


const mockTweetData = {
  data: [
    { id: '1', text: 'Test tweet for sports topic', author_id: 'user1', created_at: new Date().toISOString() },
    { id: '2', text: 'Another sports related tweet', author_id: 'user2', created_at: new Date().toISOString() },
  ],
  includes: {
    users: [
      {id: 'user1', username: 'UserOne', name: 'User One', profile_image_url: 'http://example.com/img1.png'},
      {id: 'user2', username: 'UserTwo', name: 'User Two', profile_image_url: 'http://example.com/img2.png'}
    ]
  }
};

const server = setupServer(
  http.get('/api/twitter/search', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    if (query?.toLowerCase().includes('sports')) { // Make it case-insensitive for robustness
      return HttpResponse.json(mockTweetData);
    }
    return HttpResponse.json({ data: [], includes: {users: []} });
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  // Clear any persistent mocks or states if necessary, e.g., localStorage or sessionStorage
  // jest.clearAllMocks(); // if using jest.fn() on imports and want to reset calls between tests
});
afterAll(() => server.close());

const renderHomePage = async () => {
  // Use act to ensure all updates are processed
  await act(async () => {
    render(
      <TopicProvider>
        <Home />
      </TopicProvider>
    );
  });
};

describe('Home Page Integration', () => {
  it('fetches and displays tweets for the selected topic, updating the map mock', async () => {
    await renderHomePage();

    // Default topic is Sports. Wait for data to load.
    await waitFor(() => {
      expect(screen.queryAllByText(/Test tweet for sports topic/i).length).toBeGreaterThan(0);
    }, { timeout: 3000 }); // Increased timeout for potentially slower CI

    const mapMock = screen.getByTestId('dynamic-map-mock');
    expect(mapMock).toHaveTextContent(`Map Points: ${mockTweetData.data.length}`);
  });

  it('shows loading state initially and then content', async () => {
    server.use(
        http.get('/api/twitter/search', async () => {
            await new Promise(resolve => setTimeout(resolve, 200)); // simulate delay
            return HttpResponse.json(mockTweetData);
        }, { once: true }) // Ensure this handler is used only once if other tests need default
    );
    await renderHomePage();

    expect(screen.getByText(/Loading map data.../i)).toBeInTheDocument();

    await waitFor(() => {
        expect(screen.queryByText(/Loading map data.../i)).not.toBeInTheDocument();
        expect(screen.queryAllByText(/Test tweet for sports topic/i).length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  it('changes displayed content when a new topic is selected', async () => {
    await renderHomePage();

    // Initially Sports is selected and data is loaded
    await waitFor(() => {
      expect(screen.getByTestId('dynamic-map-mock')).toHaveTextContent(`Map Points: ${mockTweetData.data.length}`);
    });

    // Mock response for "Politics" topic
    const politicsTweets = { data: [{ id: '3', text: 'Politics tweet', author_id: 'user3', created_at: new Date().toISOString() }], includes: { users: [{id: 'user3', username: 'UserThree', name: 'User Three'}]} };
    server.use(
      http.get('/api/twitter/search', ({request}) => {
        const url = new URL(request.url);
        const query = url.searchParams.get('q');
        if (query?.toLowerCase().includes('politics')) {
          return HttpResponse.json(politicsTweets);
        }
        return HttpResponse.json({ data: [], includes: {users: []} });
      })
    );

    const politicsButton = screen.getByRole('button', { name: 'Politics' });
    await act(async () => {
       userEvent.click(politicsButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/Politics tweet/i)).toBeInTheDocument();
      expect(screen.getByTestId('dynamic-map-mock')).toHaveTextContent(`Map Points: ${politicsTweets.data.length}`);
    }, { timeout: 3000 });
  });
});
