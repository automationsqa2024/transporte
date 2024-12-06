import React from 'react';
import { useMapStore } from '../../store/mapStore';
import { getMarkerIconUrl } from '../../utils/mapUtils';
import { TransportIncident } from '../../types';

interface MapMarkersProps {
  map: google.maps.Map;
}

export const MapMarkers: React.FC<MapMarkersProps> = ({ map }) => {
  const { incidents, selectedIncidentType } = useMapStore();
  const markersRef = React.useRef<google.maps.Marker[]>([]);

  React.useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Filter incidents based on selected type
    const filteredIncidents = selectedIncidentType
      ? incidents.filter(incident => incident.type === selectedIncidentType)
      : incidents;

    // Add new markers
    filteredIncidents.forEach((incident: TransportIncident) => {
      const marker = new google.maps.Marker({
        position: incident.location,
        map,
        title: incident.description,
        icon: {
          url: getMarkerIconUrl(incident.type),
          scaledSize: new google.maps.Size(30, 30),
        },
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-bold">${incident.type.toUpperCase()}</h3>
            <p>${incident.description}</p>
            <p class="text-sm text-gray-500">
              ${new Date(incident.timestamp).toLocaleString()}
            </p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [incidents, selectedIncidentType, map]);

  return null;
};