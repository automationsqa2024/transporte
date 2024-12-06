import { Location } from '../types';

interface GeocodeResult {
  location: Location | null;
  error?: string;
}

export const geocodeAddress = async (address: string): Promise<GeocodeResult> => {
  try {
    const geocoder = new google.maps.Geocoder();
    const result = await geocoder.geocode({
      address,
      componentRestrictions: { country: 'CO' },
      region: 'CO'
    });

    if (result.results?.[0]) {
      return {
        location: {
          lat: result.results[0].geometry.location.lat(),
          lng: result.results[0].geometry.location.lng(),
          address: result.results[0].formatted_address,
        }
      };
    }
    
    return {
      location: null,
      error: 'No se encontró la ubicación. Por favor, sea más específico.'
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      location: null,
      error: 'Error al buscar la ubicación. Por favor, intente de nuevo.'
    };
  }
};

export const geocodeLocations = async (
  originAddress: string,
  destinationAddress: string
): Promise<{ 
  origin: Location | null;
  destination: Location | null;
  error?: string;
}> => {
  try {
    const [originResult, destinationResult] = await Promise.all([
      geocodeAddress(originAddress),
      geocodeAddress(destinationAddress)
    ]);

    if (originResult.error || destinationResult.error) {
      return {
        origin: null,
        destination: null,
        error: 'No se encontró una o ambas ubicaciones. Por favor, sea más específico.'
      };
    }

    return {
      origin: originResult.location,
      destination: destinationResult.location
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      origin: null,
      destination: null,
      error: 'Error al buscar las ubicaciones. Por favor, intente de nuevo.'
    };
  }
};