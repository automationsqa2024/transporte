import React from 'react';
import { Car, Bus, PersonStanding, Timer, AlertTriangle } from 'lucide-react';
import { RouteDetails, TransportMode } from '../../types';
import { formatDuration, calculateCO2Savings } from '../../utils/routeUtils';

interface RouteComparisonProps {
  routes: Record<TransportMode, RouteDetails>;
  distance: number;
}

export const RouteComparison: React.FC<RouteComparisonProps> = ({ routes, distance }) => {
  const getIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'DRIVING': return Car;
      case 'TRANSIT': return Bus;
      case 'WALKING': return PersonStanding;
      default: return Car;
    }
  };

  const getModeLabel = (mode: TransportMode) => {
    switch (mode) {
      case 'DRIVING': return 'Automóvil';
      case 'TRANSIT': return 'Transporte público';
      case 'WALKING': return 'A pie';
      default: return mode;
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-semibold text-gray-800">Comparativa de rutas</h3>
      
      {Object.entries(routes).map(([mode, details]) => {
        const Icon = getIcon(mode as TransportMode);
        const hasIncidents = details.incidents && details.incidents.length > 0;
        
        return (
          <div
            key={mode}
            className={`p-4 rounded-lg ${
              hasIncidents ? 'bg-yellow-50 border border-yellow-100' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${hasIncidents ? 'text-yellow-600' : 'text-gray-600'}`} />
                <span className="font-medium">{getModeLabel(mode as TransportMode)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{formatDuration(details.duration)}</span>
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-600">
              <p>Distancia: {details.distance}</p>
              
              {hasIncidents && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2 text-yellow-700">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Incidentes en la ruta:</span>
                  </div>
                  {details.incidents?.map((incident, index) => (
                    <div key={index} className="ml-6 text-yellow-600">
                      <p>• {incident.description}</p>
                      <p className="text-xs text-yellow-500">{incident.distance}</p>
                    </div>
                  ))}
                </div>
              )}

              {mode === 'WALKING' && (
                <div className="mt-2 text-green-600">
                  <p>🌱 CO2 ahorrado: {calculateCO2Savings(distance)} kg</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};