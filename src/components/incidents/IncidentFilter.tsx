import React from 'react';
import { useMapStore } from '../../store/mapStore';
import { AlertTriangle, Construction, Car } from 'lucide-react';

export const IncidentFilter: React.FC = () => {
  const { selectedIncidentType, setSelectedIncidentType } = useMapStore();

  const incidentTypes = [
    { value: '', label: 'Todos los incidentes', icon: AlertTriangle },
    { value: 'accident', label: 'Accidentes', icon: AlertTriangle },
    { value: 'construction', label: 'Obras en vía', icon: Construction },
    { value: 'congestion', label: 'Congestión', icon: Car },
  ];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filtrar por tipo de incidente
      </label>
      <div className="grid grid-cols-2 gap-2">
        {incidentTypes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setSelectedIncidentType(value || null)}
            className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-colors
              ${selectedIncidentType === value || (!selectedIncidentType && !value)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};