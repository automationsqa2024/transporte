import React from 'react';
import { useMapStore } from './store/mapStore';
import { VehicleStatus } from './components/monitoring/VehicleStatus';
import { FuelConsumptionChart } from './components/monitoring/FuelConsumptionChart';
import { MapOverlay } from './components/map/MapOverlay';
import { Map } from './components/map/Map';
import { LocationSearch } from './components/search/LocationSearch';
import { SearchButton } from './components/search/SearchButton';
import { RouteDetails } from './components/routes/RouteDetails';
import { TransportModeSelector } from './components/routes/TransportModeSelector';

function App() {
  const { selectedTransportMode, setSelectedTransportMode } = useMapStore();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Sistema Integral de Gestión de Transporte
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Planifica tu Ruta</h2>
              <div className="space-y-4">
                <LocationSearch
                  type="origin"
                  placeholder="Punto de partida"
                />
                <LocationSearch
                  type="destination"
                  placeholder="Punto de destino"
                />
                <TransportModeSelector
                  selectedMode={selectedTransportMode}
                  onModeSelect={setSelectedTransportMode}
                />
                <SearchButton />
              </div>
            </div>

            <VehicleStatus />
            <FuelConsumptionChart />
            <RouteDetails />
          </div>
          
          <div className="lg:col-span-2">
            <div className="relative h-[calc(100vh-12rem)]">
              <Map />
              <MapOverlay />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;