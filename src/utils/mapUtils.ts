export const getMarkerIconUrl = (type: string): string => {
  switch (type) {
    case 'accident':
      return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
    case 'construction':
      return 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png';
    case 'congestion':
      return 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    default:
      return 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
  }
};

export const calculateEcoImpact = (distance: number): {
  co2Saved: number;
  treesEquivalent: number;
} => {
  // Average car CO2 emissions: 404 grams per mile
  const carCO2PerKm = 0.404;
  const co2Saved = distance * carCO2PerKm;
  // One tree absorbs about 22kg of CO2 per year
  const treesEquivalent = co2Saved / 22;

  return {
    co2Saved,
    treesEquivalent: Math.round(treesEquivalent * 100) / 100,
  };
};