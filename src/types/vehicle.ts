export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  type: string;
  fuelType: 'diesel' | 'gasoline' | 'electric';
  fuelCapacity: number;
  currentFuel: number;
  fuelEfficiency: number; // km/L
  location: {
    lat: number;
    lng: number;
  };
  speed: number;
  status: 'active' | 'resting' | 'maintenance';
  lastMaintenance: Date;
  driver: {
    id: string;
    name: string;
    license: string;
    hoursWorked: number;
    lastRestTime: Date;
  };
}

export interface FuelStation {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  fuelTypes: {
    type: string;
    price: number;
    available: boolean;
  }[];
  services: string[];
  openNow: boolean;
}

export interface RestArea {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  facilities: string[];
  capacity: number;
  currentOccupancy: number;
  openNow: boolean;
  rating: number;
}

export interface Alert {
  id: string;
  type: 'fuel' | 'rest' | 'maintenance' | 'route' | 'speed';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: Date;
  vehicleId: string;
  location?: {
    lat: number;
    lng: number;
  };
  acknowledged: boolean;
}