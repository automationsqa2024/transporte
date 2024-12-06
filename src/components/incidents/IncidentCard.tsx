import React from 'react';
import { IncidentIcon } from '../icons/IncidentIcon';
import { TransportIncident } from '../../types';

interface IncidentCardProps {
  incident: TransportIncident;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident }) => {
  return (
    <div className="p-3 bg-gray-50 rounded-lg flex items-start gap-3">
      <IncidentIcon type={incident.type} />
      <div>
        <p className="font-medium">{incident.description}</p>
        <p className="text-sm text-gray-500">
          {new Date(incident.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
};