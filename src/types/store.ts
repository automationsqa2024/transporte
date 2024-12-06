import { Location, TransportMode, RouteDetails, Route, TransportIncident } from './models';

export interface MapState {
  origin: Location | null;
  destination: Location | null;
  routes: Route[];
  incidents: TransportIncident[];
  selectedIncidentType: string | null;
  selectedTransportMode: TransportMode;
  routesByMode: Record<TransportMode, RouteDetails>;
  inputValues: {
    origin: string;
    destination: string;
  };
  error: string | null;
  addIncident: (incident: TransportIncident) => void;
  removeIncident: (id: string) => void;
  setOrigin: (location: Location | null) => void;
  setDestination: (location: Location | null) => void;
  setRoutes: (routes: Route[]) => void;
  setSelectedIncidentType: (type: string | null) => void;
  setSelectedTransportMode: (mode: TransportMode) => void;
  setRoutesByMode: (routes: Record<TransportMode, RouteDetails>) => void;
  setInputValue: (type: 'origin' | 'destination', value: string) => void;
  setError: (error: string | null) => void;
  calculateRoutes: () => Promise<void>;
}