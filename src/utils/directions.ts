import { TransportMode, RouteDetails } from '../types';
import { getDirectionsOptions, checkIncidentsAlongRoute } from './routeUtils';
import { useMapStore } from '../store/mapStore';

interface DirectionsResult {
  routes: Record<TransportMode, RouteDetails>;
  error?: string;
}

export const calculateDirections = async (
  origin: string,
  destination: string
): Promise<DirectionsResult> => {
  const directionsService = new google.maps.DirectionsService();
  const modes: TransportMode[] = ['DRIVING', 'TRANSIT', 'WALKING'];
  const routeResults: Record<TransportMode, RouteDetails> = {} as Record<TransportMode, RouteDetails>;
  let hasValidRoute = false;

  try {
    const { incidents } = useMapStore.getState();

    for (const mode of modes) {
      try {
        const result = await directionsService.route(
          getDirectionsOptions(origin, destination, mode)
        );

        if (result.routes[0] && result.routes[0].legs[0]) {
          const path = result.routes[0].overview_path;
          const routeIncidents = checkIncidentsAlongRoute(path, incidents);

          routeResults[mode] = {
            distance: result.routes[0].legs[0].distance?.text || '',
            duration: result.routes[0].legs[0].duration?.value || 0,
            path: path,
            incidents: routeIncidents,
          };
          hasValidRoute = true;
        }
      } catch (error: any) {
        console.error(`Error calculating ${mode} route:`, error);
        continue;
      }
    }

    if (!hasValidRoute) {
      return {
        routes: {},
        error: 'No se encontraron rutas disponibles entre estas ubicaciones.'
      };
    }

    return { routes: routeResults };
  } catch (error) {
    console.error('Error calculating routes:', error);
    return {
      routes: {},
      error: 'Error al calcular las rutas. Por favor, intente con otras ubicaciones.'
    };
  }
};