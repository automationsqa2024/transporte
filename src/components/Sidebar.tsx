import React from 'react';
import { useMapStore } from '../store/mapStore';
import { IncidentCard } from './incidents/IncidentCard';

const Sidebar: React.FC = () => {
  const { incidents } = useMapStore();

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Incidentes Activos</h2>
      <div className="space-y-4">
        {incidents.map((incident) => (
          <IncidentCard key={incident.id} incident={incident} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;