import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { useMapStore } from '../../store/mapStore';
import { getPlacePredictions, getPlaceDetails } from '../../utils/places';

interface LocationSearchProps {
  type: 'origin' | 'destination';
  placeholder: string;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ type, placeholder }) => {
  const { inputValues, setInputValue, setError } = useMapStore();
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowPredictions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchPredictions = async () => {
      const input = inputValues[type];
      if (!input || input.length < 3) {
        setPredictions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await getPlacePredictions(input);
        setPredictions(results);
        setShowPredictions(true);
      } catch (error) {
        console.error('Error fetching predictions:', error);
        setError('Error al buscar sugerencias');
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchPredictions, 300);
    return () => clearTimeout(debounceTimer);
  }, [inputValues[type]]);

  const handlePredictionSelect = async (prediction: google.maps.places.AutocompletePrediction) => {
    setInputValue(type, prediction.description);
    setShowPredictions(false);
    setPredictions([]);
  };

  const handleClearInput = () => {
    setInputValue(type, '');
    setPredictions([]);
    setShowPredictions(false);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={inputValues[type]}
          onChange={(e) => setInputValue(type, e.target.value)}
          onFocus={() => setShowPredictions(true)}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white 
            placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 
            focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder={placeholder}
        />
        {inputValues[type] && (
          <button
            onClick={handleClearInput}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
            ) : (
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        )}
      </div>

      {showPredictions && predictions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
          <ul className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {predictions.map((prediction) => (
              <li
                key={prediction.place_id}
                onClick={() => handlePredictionSelect(prediction)}
                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <span className="ml-3 block truncate">{prediction.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};