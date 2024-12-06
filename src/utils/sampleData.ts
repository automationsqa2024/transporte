import { TransportIncident, Route } from '../types';

export const sampleIncidents: TransportIncident[] = [
  {
    id: '1',
    type: 'accident',
    location: { lat: 4.710989, lng: -74.072092 },
    description: 'Accidente múltiple en Autopista Norte',
    timestamp: new Date(),
    severity: 'high'
  },
  {
    id: '2',
    type: 'construction',
    location: { lat: 4.698120, lng: -74.084633 },
    description: 'Obras de mantenimiento Calle 26',
    timestamp: new Date(),
    severity: 'medium'
  },
  {
    id: '3',
    type: 'congestion',
    location: { lat: 4.627140, lng: -74.064449 },
    description: 'Congestión alta en Avenida Caracas',
    timestamp: new Date(),
    severity: 'high'
  }
];

export const sampleRoutes: Route[] = [
  {
    id: '1',
    points: [],
    distance: '15.2 km',
    duration: '25 min',
    type: 'main',
    ecoFriendly: true,
    trafficLevel: 'low'
  },
  {
    id: '2',
    points: [],
    distance: '17.5 km',
    duration: '30 min',
    type: 'alternative1',
    ecoFriendly: true,
    trafficLevel: 'medium'
  }
];