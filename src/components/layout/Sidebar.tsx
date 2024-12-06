import React from 'react';
import { useMapStore } from '../../store/mapStore';
import { IncidentList } from '../incidents/IncidentList';

export const Sidebar: React.FC = () => {
  const { incidents } = useMapStore();

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Incidentes Activos</h2>
      <IncidentList incidents={incidents} />
    </div>
  );
};