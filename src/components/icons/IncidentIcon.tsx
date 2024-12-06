import React from 'react';
import { AlertTriangle, Construction, Car } from 'lucide-react';

interface IncidentIconProps {
  type: string;
  className?: string;
}

export const IncidentIcon: React.FC<IncidentIconProps> = ({ type, className = "w-5 h-5" }) => {
  switch (type) {
    case 'accident':
      return <AlertTriangle className={`${className} text-red-500`} />;
    case 'construction':
      return <Construction className={`${className} text-orange-500`} />;
    case 'congestion':
      return <Car className={`${className} text-yellow-500`} />;
    default:
      return null;
  }
};