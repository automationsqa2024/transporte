import { TransportMode, RouteIncident, TransportIncident } from '../types';

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes} min`;
};

export const calculateCO2Savings = (distance: number): number => {
  // Average car CO2 emissions: 404 grams per mile
  const carCO2PerKm = 0.404;
  const distanceKm = distance / 1000;
  const co2Saved = distanceKm * carCO2PerKm;

  return Math.round(co2Saved * 100) / 100;
};

export const getDirectionsOptions = (
  origin: google.maps.LatLng | string | google.maps.LatLngLiteral,
  destination: google.maps.LatLng | string | google.maps.LatLngLiteral,
  mode: TransportMode
): google.maps.DirectionsRequest => ({
  origin,
  destination,
  travelMode: google.maps.TravelMode[mode],
  optimizeWaypoints: true,
  provideRouteAlternatives: true,
  avoidHighways: false,
  avoidTolls: false,
  ...(mode === 'TRANSIT' && {
    transitOptions: {
      modes: ['BUS', 'SUBWAY', 'TRAIN'],
      routingPreference: 'FEWER_TRANSFERS',
    },
  }),
});

export const checkIncidentsAlongRoute = (
  path: google.maps.LatLng[],
  incidents: TransportIncident[],
  threshold: number = 100 // meters
): RouteIncident[] => {
  const routeIncidents: RouteIncident[] = [];
  const bounds = new google.maps.LatLngBounds();
  path.forEach(point => bounds.extend(point));

  incidents.forEach(incident => {
    const incidentLatLng = new google.maps.LatLng(incident.location.lat, incident.location.lng);
    
    // First check if incident is within route bounds
    if (bounds.contains(incidentLatLng)) {
      // Then check distance to route path
      let minDistance = Infinity;
      let closestPoint = path[0];
      
      path.forEach((point, index) => {
        if (index === 0) return;
        
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          incidentLatLng,
          point
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          closestPoint = point;
        }
      });

      if (minDistance <= threshold) {
        const distanceFromStart = google.maps.geometry.spherical.computeLength(
          path.slice(0, path.indexOf(closestPoint) + 1)
        );

        routeIncidents.push({
          type: incident.type,
          location: incidentLatLng,
          description: incident.description,
          distance: `${(distanceFromStart / 1000).toFixed(1)} km desde el inicio`,
        });
      }
    }
  });

  return routeIncidents;
};