export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export type TransportMode = 'DRIVING' | 'TRANSIT' | 'WALKING';

export interface RouteDetails {
  distance: string;
  duration: number;
  path: google.maps.LatLng[];
  incidents?: RouteIncident[];
}

export interface RouteIncident {
  type: 'accident' | 'construction' | 'congestion';
  location: google.maps.LatLng;
  description: string;
  distance: string;
}

export interface Route {
  id: string;
  points: google.maps.LatLng[];
  distance: string;
  duration: string;
  type: 'main' | 'alternative1' | 'alternative2';
  ecoFriendly: boolean;
  trafficLevel: 'low' | 'medium' | 'high';
  incidents?: RouteIncident[];
}

export interface TransportIncident {
  id: string;
  type: 'accident' | 'construction' | 'congestion';
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}