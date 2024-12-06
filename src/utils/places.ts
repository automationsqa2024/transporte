import { Location } from '../types';
import { useVehicleStore } from '../store/vehicleStore';
import { FuelStation, RestArea } from '../types/vehicle';

let autocompleteService: google.maps.places.AutocompleteService | null = null;
let placesService: google.maps.places.PlacesService | null = null;
let sessionToken: google.maps.places.AutocompleteSessionToken | null = null;

export const initPlacesServices = (map: google.maps.Map) => {
  autocompleteService = new google.maps.places.AutocompleteService();
  placesService = new google.maps.places.PlacesService(map);
  sessionToken = new google.maps.places.AutocompleteSessionToken();
};

export const getPlacePredictions = async (
  input: string
): Promise<google.maps.places.AutocompletePrediction[]> => {
  if (!autocompleteService || !input.trim()) return [];

  try {
    const response = await autocompleteService.getPlacePredictions({
      input,
      componentRestrictions: { country: 'CO' },
      sessionToken,
      types: ['address', 'establishment', 'geocode'],
    });

    return response.predictions || [];
  } catch (error) {
    console.error('Error getting place predictions:', error);
    return [];
  }
};

export const findNearbyFuelStations = async (
  location: google.maps.LatLng,
  radius: number = 5000
): Promise<FuelStation[]> => {
  if (!placesService) return [];

  try {
    const request = {
      location,
      radius,
      type: 'gas_station'
    };

    const results = await new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
      placesService!.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else {
          reject(new Error('No fuel stations found'));
        }
      });
    });

    const stations: FuelStation[] = results.map((place, index) => ({
      id: `station-${index}`,
      name: place.name || 'Estación de Servicio',
      location: {
        lat: place.geometry?.location?.lat() || 0,
        lng: place.geometry?.location?.lng() || 0,
      },
      fuelTypes: [{
        type: 'diesel',
        price: 1.2 + Math.random() * 0.3,
        available: true
      }],
      services: ['shop', 'air', 'water'],
      openNow: place.opening_hours?.isOpen() || false
    }));

    useVehicleStore.getState().updateFuelStations(stations);
    return stations;
  } catch (error) {
    console.error('Error finding fuel stations:', error);
    return [];
  }
};

export const findRestAreas = async (
  location: google.maps.LatLng,
  radius: number = 5000
): Promise<RestArea[]> => {
  if (!placesService) return [];

  try {
    const request = {
      location,
      radius,
      type: 'parking'
    };

    const results = await new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
      placesService!.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else {
          reject(new Error('No rest areas found'));
        }
      });
    });

    const areas: RestArea[] = results.map((place, index) => ({
      id: `area-${index}`,
      name: place.name || 'Área de Descanso',
      location: {
        lat: place.geometry?.location?.lat() || 0,
        lng: place.geometry?.location?.lng() || 0,
      },
      facilities: ['parking', 'restrooms', 'restaurant'],
      capacity: 20,
      currentOccupancy: Math.floor(Math.random() * 20),
      openNow: place.opening_hours?.isOpen() || false,
      rating: place.rating || 4.0
    }));

    useVehicleStore.getState().updateRestAreas(areas);
    return areas;
  } catch (error) {
    console.error('Error finding rest areas:', error);
    return [];
  }
};