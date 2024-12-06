import React from 'react';
import { useVehicleStore } from '../../store/vehicleStore';
import { Fuel, Clock, AlertTriangle } from 'lucide-react';
import { calculateRemainingRange } from '../../utils/fuelCalculations';
import { formatDuration } from '../../utils/timeUtils';
import { Alert } from '../../types/vehicle';

interface AlertItemProps {
  alert: Alert;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert }) => (
  <div
    className={`p-3 rounded-lg ${
      alert.severity === 'high'
        ? 'bg-red-50 text-red-700'
        : alert.severity === 'medium'
        ? 'bg-yellow-50 text-yellow-700'
        : 'bg-blue-50 text-blue-700'
    }`}
  >
    <p className="font-medium">{alert.message}</p>
    <p className="text-sm opacity-75">
      {new Date(alert.timestamp).toLocaleString()}
    </p>
  </div>
);

interface FuelStatusProps {
  currentFuel: number;
  fuelCapacity: number;
  remainingRange: number;
}

const FuelStatus: React.FC<FuelStatusProps> = ({
  currentFuel,
  fuelCapacity,
  remainingRange,
}) => (
  <div className="p-3 bg-blue-50 rounded-lg">
    <div className="flex items-center gap-2 text-blue-700">
      <Fuel className="h-5 w-5" />
      <span className="font-medium">Combustible</span>
    </div>
    <div className="mt-2">
      <div className="h-2 bg-blue-200 rounded-full">
        <div
          className="h-2 bg-blue-600 rounded-full"
          style={{
            width: `${(currentFuel / fuelCapacity) * 100}%`,
          }}
        />
      </div>
      <div className="mt-1 text-sm text-blue-700">
        <span className="font-medium">{currentFuel.toFixed(1)}L</span>
        <span className="mx-1">/</span>
        <span>{fuelCapacity}L</span>
      </div>
      <p className="text-sm text-blue-600 mt-1">
        Autonomía: {remainingRange} km
      </p>
    </div>
  </div>
);

export const VehicleStatus: React.FC = () => {
  const { selectedVehicle, alerts } = useVehicleStore();

  if (!selectedVehicle) return null;

  const remainingRange = calculateRemainingRange(
    selectedVehicle.currentFuel,
    selectedVehicle.fuelEfficiency
  );

  const vehicleAlerts = alerts.filter(
    (alert) => alert.vehicleId === selectedVehicle.id && !alert.acknowledged
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Estado del Vehículo</h2>
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          {selectedVehicle.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FuelStatus
          currentFuel={selectedVehicle.currentFuel}
          fuelCapacity={selectedVehicle.fuelCapacity}
          remainingRange={remainingRange}
        />

        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 text-purple-700">
            <Clock className="h-5 w-5" />
            <span className="font-medium">Tiempo de Conducción</span>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold text-purple-700">
              {formatDuration(selectedVehicle.driver.hoursWorked)}
            </p>
            <p className="text-sm text-purple-600 mt-1">
              Último descanso:{' '}
              {new Date(selectedVehicle.driver.lastRestTime).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {vehicleAlerts.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Alertas Activas
          </h3>
          <div className="space-y-2">
            {vehicleAlerts.map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};