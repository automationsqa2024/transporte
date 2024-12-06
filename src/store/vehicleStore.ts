import { create } from 'zustand';
import { Vehicle, Alert, FuelStation, RestArea } from '../types/vehicle';

interface VehicleState {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  alerts: Alert[];
  fuelStations: FuelStation[];
  restAreas: RestArea[];
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  updateVehicleLocation: (id: string, lat: number, lng: number) => void;
  updateVehicleFuel: (id: string, fuelLevel: number) => void;
  updateDriverHours: (vehicleId: string, hours: number) => void;
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (id: string) => void;
  updateFuelStations: (stations: FuelStation[]) => void;
  updateRestAreas: (areas: RestArea[]) => void;
}

// Sample vehicle data
const sampleVehicle: Vehicle = {
  id: 'v1',
  plate: 'ABC123',
  model: 'Volvo FH16',
  type: 'truck',
  fuelType: 'diesel',
  fuelCapacity: 600,
  currentFuel: 450,
  fuelEfficiency: 3.2, // km/L
  location: {
    lat: 4.710989,
    lng: -74.072092,
  },
  speed: 0,
  status: 'active',
  lastMaintenance: new Date('2024-01-15'),
  driver: {
    id: 'd1',
    name: 'Juan Pérez',
    license: 'C123456',
    hoursWorked: 3.5,
    lastRestTime: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
  },
};

export const useVehicleStore = create<VehicleState>((set) => ({
  vehicles: [sampleVehicle],
  selectedVehicle: sampleVehicle,
  alerts: [],
  fuelStations: [],
  restAreas: [],
  
  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
  
  updateVehicleLocation: (id, lat, lng) => set((state) => ({
    vehicles: state.vehicles.map((v) =>
      v.id === id ? { ...v, location: { lat, lng } } : v
    ),
  })),
  
  updateVehicleFuel: (id, fuelLevel) => set((state) => ({
    vehicles: state.vehicles.map((v) =>
      v.id === id ? { ...v, currentFuel: fuelLevel } : v
    ),
  })),
  
  updateDriverHours: (vehicleId, hours) => set((state) => ({
    vehicles: state.vehicles.map((v) =>
      v.id === vehicleId
        ? { ...v, driver: { ...v.driver, hoursWorked: hours } }
        : v
    ),
  })),
  
  addAlert: (alert) => set((state) => ({
    alerts: [alert, ...state.alerts],
  })),
  
  acknowledgeAlert: (id) => set((state) => ({
    alerts: state.alerts.map((a) =>
      a.id === id ? { ...a, acknowledged: true } : a
    ),
  })),
  
  updateFuelStations: (stations) => set({ fuelStations: stations }),
  
  updateRestAreas: (areas) => set({ restAreas: areas }),
}));