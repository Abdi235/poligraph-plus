"use client"; // This component will be client-side

import React from 'react';
// Marker and L are not used directly in the current implementation
// import L from 'leaflet';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';


import { MapPoint } from './InteractiveMap';
// import HeatmapLayer from 'react-leaflet-heatmap-layer-v3'; // Would import if compatible
// import 'leaflet.heat'; // Peer dependency for the heatmap layer

interface DynamicMapProps {
  points: MapPoint[];
  heatmapData?: [number, number, number][] | null; // Optional: [lat, lng, intensity][]
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


const DynamicMap: React.FC<DynamicMapProps> = ({ points, heatmapData }) => {
  const defaultPosition: [number, number] = [20, 0]; // Default center of the map (e.g., world view)
  const defaultZoom = 2;

  // Heatmap Layer Configuration (would be used if HeatmapLayer component was imported and working)
  // const heatmapOptions = {
  //   radius: 20,
  //   blur: 20,
  //   maxZoom: 18,
  //   gradient: { 0.1: 'blue', 0.3: 'lime', 0.5: 'yellow', 0.8: 'red' },
  //   minOpacity: 0.3,
  // };


  const getSentimentColor = (sentimentScore: number): string => {
    if (sentimentScore > 0.5) return 'green';
    if (sentimentScore > 0.1) return 'lightgreen';
    if (sentimentScore < -0.5) return 'red';
    if (sentimentScore < -0.1) return 'pink';
    return 'gray';
  };


  return (
    <MapContainer center={defaultPosition} zoom={defaultZoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Heatmap Layer would go here */}
      {heatmapData && heatmapData.length > 0 && (
        <>
          {/* <HeatmapLayer
            points={heatmapData}
            longitudeExtractor={(m: any) => m[1]}
            latitudeExtractor={(m: any) => m[0]}
            intensityExtractor={(m: any) => m[2]}
            {...heatmapOptions}
          /> */}
          <div style={{ position: 'absolute', top: '10px', left: '50px', zIndex: 1000, background: 'white', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}>
            Heatmap data prepared ({heatmapData.length} points). Layer component pending due to React version compatibility.
          </div>
        </>
      )}
      {points.map(point => (
        <CircleMarker
          key={point.id}
          center={[point.latitude, point.longitude]} // Use new lat/lon fields
          radius={8}
          pathOptions={{
            color: getSentimentColor(point.sentimentScore),
            fillColor: getSentimentColor(point.sentimentScore),
            fillOpacity: 0.7
          }}
        >
          <Popup>
            <strong>{point.locationDisplayName || 'Geocoded Location'}</strong><br />
            Sentiment Score: {point.sentimentScore.toFixed(2)}<br />
            Post: &quot;{point.displayText}&quot;
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default DynamicMap;
