import React from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { useMapStore } from '../../store/mapStore';

export const SearchButton: React.FC = () => {
  const { inputValues, calculateRoutes, error } = useMapStore();
  const isDisabled = !inputValues.origin || !inputValues.destination;

  return (
    <div className="space-y-2">
      <button
        onClick={calculateRoutes}
        disabled={isDisabled}
        className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg text-white font-medium
          ${isDisabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
      >
        <Search className="h-5 w-5" />
        Calcular Ruta
      </button>
      
      {error && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};