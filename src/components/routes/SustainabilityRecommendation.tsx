import React from 'react';
import { Leaf, Heart } from 'lucide-react';
import { RouteDetails, TransportMode } from '../../types';
import { calculateCO2Savings } from '../../utils/routeUtils';

interface SustainabilityRecommendationProps {
  routes: Record<TransportMode, RouteDetails>;
  distance: number;
}

export const SustainabilityRecommendation: React.FC<SustainabilityRecommendationProps> = ({
  routes,
  distance,
}) => {
  const walkingTime = routes.WALKING?.duration || 0;

  const getRecommendation = () => {
    if (walkingTime <= 3600) { // 60 minutes in seconds
      return {
        mode: 'WALKING' as TransportMode,
        icon: Heart,
        message: 'Caminar es la mejor opción para este trayecto.',
        benefits: [
          'Mejora tu salud cardiovascular',
          'Reduce el estrés y mejora el estado de ánimo',
          'Contribuye al medio ambiente',
        ],
      };
    }
    return null;
  };

  const recommendation = getRecommendation();

  if (!recommendation) return null;

  const { icon: Icon, message, benefits } = recommendation;

  return (
    <div className="bg-green-50 p-4 rounded-lg mt-4 border border-green-100">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-5 w-5 text-green-600" />
        <h3 className="font-medium text-green-800">Recomendación Sostenible</h3>
      </div>
      
      <p className="text-green-700 mb-2">{message}</p>
      
      <ul className="space-y-2">
        {benefits.map((benefit, index) => (
          <li key={index} className="text-sm text-green-600 flex items-center gap-2">
            <span className="text-green-500">•</span>
            {benefit}
          </li>
        ))}
      </ul>
      
      <div className="mt-3 text-sm text-green-600">
        <p>🌱 Ahorro estimado de CO2: {calculateCO2Savings(distance)} kg</p>
      </div>
    </div>
  );
};