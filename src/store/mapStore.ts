import { create } from 'zustand';
import { MapState, TransportMode, RouteDetails } from '../types';
import { sampleIncidents, sampleRoutes } from '../utils/sampleData';
import { geocodeLocations } from '../utils/geocoding';
import { calculateDirections } from '../utils/directions';

export const useMapStore = create<MapState>((set, get) => ({
  origin: null,
  destination: null,
  routes: sampleRoutes,
  incidents: sampleIncidents,
  selectedIncidentType: null,
  selectedTransportMode: 'DRIVING',
  routesByMode: {} as Record<TransportMode, RouteDetails>,
  inputValues: {
    origin: '',
    destination: ''
  },
  error: null,
  addIncident: (incident) =>
    set((state) => ({
      incidents: [...state.incidents, incident],
    })),
  removeIncident: (id) =>
    set((state) => ({
      incidents: state.incidents.filter((incident) => incident.id !== id),
    })),
  setOrigin: (location) => set({ origin: location }),
  setDestination: (location) => set({ destination: location }),
  setRoutes: (routes) => set({ routes }),
  setSelectedIncidentType: (type) => set({ selectedIncidentType: type }),
  setSelectedTransportMode: (mode) => set({ selectedTransportMode: mode }),
  setRoutesByMode: (routes) => set({ routesByMode: routes }),
  setError: (error) => set({ error }),
  setInputValue: (type, value) => set((state) => ({
    inputValues: {
      ...state.inputValues,
      [type]: value
    }
  })),
  calculateRoutes: async () => {
    const { 
      inputValues, 
      setOrigin, 
      setDestination, 
      setRoutesByMode, 
      setError 
    } = get();

    if (!inputValues.origin || !inputValues.destination) {
      setError('Por favor ingrese ambas ubicaciones');
      return;
    }

    // First geocode the locations
    const locations = await geocodeLocations(
      inputValues.origin,
      inputValues.destination
    );

    if (locations.error || !locations.origin || !locations.destination) {
      setError(locations.error || 'Error al procesar las ubicaciones');
      return;
    }

    setOrigin(locations.origin);
    setDestination(locations.destination);

    // Then calculate the routes
    const directionsResult = await calculateDirections(
      locations.origin.address,
      locations.destination.address
    );

    if (directionsResult.error) {
      setError(directionsResult.error);
      setRoutesByMode({});
    } else {
      setError(null);
      setRoutesByMode(directionsResult.routes);
    }
  }
}));