import React from 'react';
import { useVehicleStore } from '../../store/vehicleStore';
import { Fuel, Bed, MapPin } from 'lucide-react';
import { FuelStation, RestArea } from '../../types/vehicle';

interface StationItemProps {
  station: FuelStation;
}

const StationItem: React.FC<StationItemProps> = ({ station }) => (
  <div className="text-sm p-2 bg-gray-50 rounded">
    <p className="font-medium">{station.name}</p>
    <p className="text-gray-600">
      {station.fuelTypes[0].price.toFixed(2)} €/L
    </p>
  </div>
);

interface RestAreaItemProps {
  area: RestArea;
}

const RestAreaItem: React.FC<RestAreaItemProps> = ({ area }) => (
  <div className="text-sm p-2 bg-gray-50 rounded">
    <p className="font-medium">{area.name}</p>
    <p className="text-gray-600">
      Ocupación: {area.currentOccupancy}/{area.capacity}
    </p>
  </div>
);

export const MapOverlay: React.FC = () => {
  const { selectedVehicle, fuelStations, restAreas } = useVehicleStore();

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 w-64 space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Leyenda</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            <span className="text-sm">Vehículo</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="h-5 w-5 text-red-500" />
            <span className="text-sm">Estación de Servicio</span>
          </div>
          <div className="flex items-center gap-2">
            <Bed className="h-5 w-5 text-green-500" />
            <span className="text-sm">Área de Descanso</span>
          </div>
        </div>
      </div>

      {selectedVehicle && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Estaciones Cercanas
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {fuelStations.slice(0, 3).map((station) => (
              <StationItem key={station.id} station={station} />
            ))}
          </div>
        </div>
      )}

      {selectedVehicle && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Áreas de Descanso
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {restAreas.slice(0, 3).map((area) => (
              <RestAreaItem key={area.id} area={area} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};