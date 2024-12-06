import React from 'react';
import { useMapStore } from '../../store/mapStore';
import { MapPin, Clock, AlertTriangle } from 'lucide-react';

export const RouteList: React.FC = () => {
  const { routes } = useMapStore();

  const getRouteColor = (type: string) => {
    switch (type) {
      case 'main': return 'text-blue-600';
      case 'alternative1': return 'text-green-600';
      case 'alternative2': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {routes.map((route) => (
        <div key={route.id} className="bg-white p-4 rounded-lg shadow">
          <div className={`flex items-center gap-2 font-medium ${getRouteColor(route.type)}`}>
            <MapPin className="h-5 w-5" />
            <span>
              {route.type === 'main' ? 'Ruta Principal' : `Alternativa ${route.type.slice(-1)}`}
            </span>
          </div>
          
          <div className="mt-2 space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{route.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{route.distance}</span>
            </div>
            {route.trafficLevel === 'high' && (
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-4 w-4" />
                <span>Alto nivel de tráfico</span>
              </div>
            )}
          </div>

          {route.ecoFriendly && (
            <div className="mt-2 text-sm text-green-600">
              ♻️ Opción ecológica disponible
            </div>
          )}
        </div>
      ))}
    </div>
  );
};