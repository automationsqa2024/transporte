import React from 'react';
import { IncidentCard } from './IncidentCard';
import { TransportIncident } from '../../types';

interface IncidentListProps {
  incidents: TransportIncident[];
}

export const IncidentList: React.FC<IncidentListProps> = ({ incidents }) => {
  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <IncidentCard key={incident.id} incident={incident} />
      ))}
    </div>
  );
};