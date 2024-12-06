import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useMapStore } from '../store/mapStore';
import { getMarkerIconUrl } from '../utils/mapUtils';
import { getDirectionsOptions } from '../utils/routeUtils';
import { RouteDetails, TransportMode } from '../types';

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const { 
    incidents, 
    origin, 
    destination, 
    selectedTransportMode,
    setRoutesByMode 
  } = useMapStore();

  useEffect(() => {
    const loader = new Loader({
      apiKey: 'AIzaSyBMtgyQ2jSK8B0ymMpVhoshgl6kT7-7Isk',
      version: 'weekly',
      libraries: ['places', 'routes'],
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 4.710989, lng: -74.072092 }, // Bogotá
          zoom: 12,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        });

        mapInstanceRef.current = map;
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
        });

        incidents.forEach((incident) => {
          new google.maps.Marker({
            position: incident.location,
            map,
            title: incident.description,
            icon: {
              url: getMarkerIconUrl(incident.type),
              scaledSize: new google.maps.Size(30, 30),
            },
          });
        });
      }
    });
  }, []);

  useEffect(() => {
    const calculateRoutes = async () => {
      if (!origin || !destination || !mapInstanceRef.current) return;

      const directionsService = new google.maps.DirectionsService();
      const modes: TransportMode[] = ['DRIVING', 'TRANSIT', 'BICYCLING', 'WALKING'];
      const routeResults: Record<TransportMode, RouteDetails> = {} as Record<TransportMode, RouteDetails>;

      try {
        for (const mode of modes) {
          const result = await directionsService.route(
            getDirectionsOptions(origin.address, destination.address, mode)
          );

          if (result.routes[0] && result.routes[0].legs[0]) {
            routeResults[mode] = {
              distance: result.routes[0].legs[0].distance?.text || '',
              duration: result.routes[0].legs[0].duration?.value || 0,
              path: result.routes[0].overview_path || [],
            };
          }
        }

        setRoutesByMode(routeResults);

        // Update the displayed route for the selected mode
        const selectedResult = await directionsService.route(
          getDirectionsOptions(origin.address, destination.address, selectedTransportMode)
        );
        directionsRendererRef.current?.setDirections(selectedResult);
      } catch (error) {
        console.error('Error calculating routes:', error);
      }
    };

    calculateRoutes();
  }, [origin, destination, selectedTransportMode]);

  return <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg" />;
};

export default Map;