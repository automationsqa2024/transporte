import React from 'react';
import { useMapStore } from '../../store/mapStore';
import { AlertTriangle, TrendingUp, Calendar } from 'lucide-react';

export const SafetyStats: React.FC = () => {
  const { incidents } = useMapStore();

  const getIncidentStats = () => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentIncidents = incidents.filter(
      incident => new Date(incident.timestamp) >= lastWeek
    );

    const byType = recentIncidents.reduce((acc, incident) => {
      acc[incident.type] = (acc[incident.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return byType;
  };

  const stats = getIncidentStats();

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        Estadísticas de Seguridad
      </h2>

      <div className="space-y-4">
        {Object.entries(stats).map(([type, count]) => (
          <div key={type} className="flex items-center justify-between">
            <span className="text-gray-600 capitalize">{type}</span>
            <span className="font-medium">{count} incidentes</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Últimos 7 días</span>
        </div>
      </div>
    </div>
  );
};