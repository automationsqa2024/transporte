import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useMapStore } from '../../store/mapStore';
import { useVehicleStore } from '../../store/vehicleStore';
import { getDirectionsOptions } from '../../utils/routeUtils';
import { initPlacesServices, findNearbyFuelStations, findRestAreas } from '../../utils/places';
import { MapMarkers } from './MapMarkers';

export const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const originMarkerRef = useRef<google.maps.Marker | null>(null);
  const destinationMarkerRef = useRef<google.maps.Marker | null>(null);
  
  const { 
    origin, 
    destination,
    selectedTransportMode,
    setError
  } = useMapStore();

  const { selectedVehicle } = useVehicleStore();

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
          polylineOptions: {
            strokeColor: '#4A90E2',
            strokeWeight: 6,
            strokeOpacity: 0.8
          }
        });

        initPlacesServices(map);
      }
    }).catch(error => {
      console.error('Error loading Google Maps:', error);
      setError('Error al cargar el mapa. Por favor, recargue la página.');
    });

    return () => {
      if (originMarkerRef.current) originMarkerRef.current.setMap(null);
      if (destinationMarkerRef.current) destinationMarkerRef.current.setMap(null);
      if (directionsRendererRef.current) directionsRendererRef.current.setMap(null);
    };
  }, []);

  useEffect(() => {
    const updateRoute = async () => {
      if (!origin || !destination || !mapInstanceRef.current || !directionsRendererRef.current) return;

      // Clear existing route and markers
      directionsRendererRef.current.setDirections({ routes: [] });
      if (originMarkerRef.current) originMarkerRef.current.setMap(null);
      if (destinationMarkerRef.current) destinationMarkerRef.current.setMap(null);
      
      const directionsService = new google.maps.DirectionsService();

      try {
        const request = getDirectionsOptions(
          { lat: origin.lat, lng: origin.lng },
          { lat: destination.lat, lng: destination.lng },
          selectedTransportMode
        );

        const result = await directionsService.route(request);

        // Update the map bounds to show the entire route
        const bounds = new google.maps.LatLngBounds();
        result.routes[0].legs.forEach(leg => {
          bounds.extend(leg.start_location);
          bounds.extend(leg.end_location);
        });
        mapInstanceRef.current.fitBounds(bounds);

        // Display the route
        directionsRendererRef.current.setDirections(result);

        // Find nearby services along the route
        if (selectedVehicle) {
          const path = result.routes[0].overview_path;
          const midpoint = path[Math.floor(path.length / 2)];
          
          await Promise.all([
            findNearbyFuelStations(midpoint),
            findRestAreas(midpoint)
          ]);
        }

        // Add origin marker
        originMarkerRef.current = new google.maps.Marker({
          position: { lat: origin.lat, lng: origin.lng },
          map: mapInstanceRef.current,
          title: 'Origen',
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
            scaledSize: new google.maps.Size(40, 40),
          },
        });

        // Add destination marker
        destinationMarkerRef.current = new google.maps.Marker({
          position: { lat: destination.lat, lng: destination.lng },
          map: mapInstanceRef.current,
          title: 'Destino',
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new google.maps.Size(40, 40),
          },
        });

      } catch (error: any) {
        console.error('Error displaying route:', error);
        if (error.code === 'ZERO_RESULTS') {
          setError(`No hay rutas disponibles para ${selectedTransportMode === 'BICYCLING' ? 'bicicleta' : 'este modo de transporte'} entre estos puntos. Por favor, intente con otro modo de transporte.`);
        } else {
          setError('Error al mostrar la ruta. Por favor, intente con otra ruta.');
        }
      }
    };

    updateRoute();
  }, [origin, destination, selectedTransportMode, selectedVehicle]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg">
      {mapInstanceRef.current && <MapMarkers map={mapInstanceRef.current} />}
    </div>
  );
};