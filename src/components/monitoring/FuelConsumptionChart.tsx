import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useVehicleStore } from '../../store/vehicleStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const FuelConsumptionChart: React.FC = () => {
  const { selectedVehicle } = useVehicleStore();

  if (!selectedVehicle) return null;

  // Simulated data - in a real app, this would come from historical data
  const labels = ['1h', '2h', '3h', '4h', '5h', '6h'];
  const consumption = [8.2, 7.9, 8.4, 8.1, 7.8, 8.0];

  const data = {
    labels,
    datasets: [
      {
        label: 'Consumo (L/100km)',
        data: consumption,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Consumo de Combustible',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
      <Line options={options} data={data} />
    </div>
  );
};