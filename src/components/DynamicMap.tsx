"use client"; // This component will be client-side

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet'; // Import L for custom icons or other Leaflet functionalities if needed

// Mock sentiment data structure for map points
interface MapSentimentPoint {
  id: string;
  topic?: string; // Optional: if data is pre-filtered
  region: string; // For display
  sentiment: number;
  coordinates: [number, number]; // [latitude, longitude]
  text?: string; // Sample text for popup
}

interface DynamicMapProps {
  data: MapSentimentPoint[]; // Data points to visualize
  // selectedTopic?: string; // Could be used for filtering if data isn't pre-filtered
}

// Fix for default icon issue with Webpack
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
//   iconUrl: require('leaflet/dist/images/marker-icon.png').default,
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
// });
// The above icon fix might not be needed with newer react-leaflet and Next.js versions,
// but it's a common historical fix. If icons are broken, this is a place to look.
// For now, relying on default CSS-based icons or simple CircleMarkers.


const DynamicMap: React.FC<DynamicMapProps> = ({ data }) => {
  const defaultPosition: [number, number] = [20, 0]; // Default center of the map (e.g., world view)
  const defaultZoom = 2;

  const getSentimentColor = (sentiment: number): string => {
    if (sentiment > 0.5) return 'green'; // Strong positive
    if (sentiment > 0.1) return 'lightgreen'; // Mild positive
    if (sentiment < -0.5) return 'red'; // Strong negative
    if (sentiment < -0.1) return 'pink'; // Mild negative
    return 'gray'; // Neutral
  };


  return (
    <MapContainer center={defaultPosition} zoom={defaultZoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data.map(point => (
        <CircleMarker
          key={point.id}
          center={point.coordinates}
          radius={8} // Adjust radius as needed
          pathOptions={{
            color: getSentimentColor(point.sentiment),
            fillColor: getSentimentColor(point.sentiment),
            fillOpacity: 0.7
          }}
        >
          <Popup>
            <strong>{point.region || 'Sentiment Point'}</strong><br />
            Sentiment: {point.sentiment.toFixed(2)}<br />
            {point.text && `Text: "${point.text.substring(0, 50)}..."`}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default DynamicMap;
