import React from 'react';
import { useMapStore } from '../../store/mapStore';
import { useVehicleStore } from '../../store/vehicleStore';
import { Clock, Route, AlertTriangle } from 'lucide-react';
import { shouldRefuel } from '../../utils/fuelCalculations';
import { shouldTakeBreak } from '../../utils/timeUtils';
import { formatDuration } from '../../utils/routeUtils';

export const RouteDetails: React.FC = () => {
  const { selectedTransportMode, routesByMode } = useMapStore();
  const { selectedVehicle, fuelStations } = useVehicleStore();

  const currentRoute = routesByMode[selectedTransportMode];
  
  if (!currentRoute || !selectedVehicle) return null;

  const distanceInKm = parseFloat(currentRoute.distance.replace(' km', ''));
  const needsRefuel = shouldRefuel(
    selectedVehicle.currentFuel,
    selectedVehicle.fuelCapacity,
    distanceInKm,
    selectedVehicle.fuelEfficiency
  );

  const needsBreak = shouldTakeBreak(
    selectedVehicle.driver.lastRestTime,
    selectedVehicle.driver.hoursWorked
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
      <h3 className="text-lg font-semibold mb-3">Detalles de la Ruta</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Route className="h-5 w-5 text-blue-600" />
            <span>Distancia total: {currentRoute.distance}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>{formatDuration(currentRoute.duration)}</span>
          </div>
        </div>

        {needsRefuel && (
          <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-700 font-medium">
                Repostaje necesario durante el viaje
              </p>
              <p className="text-sm text-yellow-600">
                {fuelStations.length > 0
                  ? 'Hay estaciones de servicio disponibles en la ruta'
                  : 'No se encontraron estaciones cercanas'}
              </p>
            </div>
          </div>
        )}

        {needsBreak && (
          <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-medium">
                Descanso obligatorio requerido
              </p>
              <p className="text-sm text-red-600">
                El conductor debe tomar un descanso durante este viaje
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};