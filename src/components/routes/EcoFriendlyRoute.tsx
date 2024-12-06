import React from 'react';
import { Walk } from 'lucide-react';
import { calculateCO2Savings } from '../../utils/routeUtils';

interface EcoFriendlyRouteProps {
  distance: number;
}

export const EcoFriendlyRoute: React.FC<EcoFriendlyRouteProps> = ({ distance }) => {
  const co2Saved = calculateCO2Savings(distance);
  const treesEquivalent = Math.round((co2Saved / 22) * 100) / 100; // One tree absorbs about 22kg of CO2 per year

  return (
    <div className="bg-green-50 p-4 rounded-lg mt-4">
      <h3 className="text-green-800 font-medium mb-2">Opciones Ecológicas</h3>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Walk className="h-5 w-5 text-green-600" />
          <span className="text-sm text-green-700">
            Ruta peatonal disponible
          </span>
        </div>

        <div className="text-sm text-green-700 mt-2">
          <p>Ahorro estimado de CO2: {co2Saved.toFixed(2)} kg</p>
          <p>Equivalente a {treesEquivalent} árboles por año</p>
        </div>
      </div>
    </div>
  );
};