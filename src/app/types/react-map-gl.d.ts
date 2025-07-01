declare module 'react-map-gl' {
  import * as React from 'react';

  export interface ViewState {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch?: number;
    bearing?: number;
  }

  interface MapProps {
    initialViewState: ViewState;
    mapStyle: string;
    mapboxAccessToken?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export class Map extends React.Component<MapProps> {}

  export interface NavigationControlProps {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  }

  export class NavigationControl extends React.Component<NavigationControlProps> {}

  export default Map;
}
