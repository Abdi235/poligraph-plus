"use client";
import React from "react";
import Map, { NavigationControl } from "react-map-gl";

export default function SentimentMap() {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: -79.3832,
          latitude: 43.6532,
          zoom: 4,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />
      </Map>
    </div>
  );
}
