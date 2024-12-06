import React from 'react';
import { Car, Bus, PersonStanding } from 'lucide-react';
import { TransportMode } from '../../types';

interface TransportModeSelectorProps {
  selectedMode: TransportMode;
  onModeSelect: (mode: TransportMode) => void;
}

export const TransportModeSelector: React.FC<TransportModeSelectorProps> = ({
  selectedMode,
  onModeSelect,
}) => {
  const transportModes = [
    { id: 'DRIVING', icon: Car, label: 'Automóvil' },
    { id: 'TRANSIT', icon: Bus, label: 'Transporte público' },
    { id: 'WALKING', icon: PersonStanding, label: 'A pie' },
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-2 mt-4">
      {transportModes.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onModeSelect(id)}
          className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-colors
            ${
              selectedMode === id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
        >
          <Icon className="h-5 w-5" />
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
};