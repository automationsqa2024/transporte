export const calculateRemainingRange = (
  currentFuel: number,
  fuelEfficiency: number
): number => {
  return Math.round(currentFuel * fuelEfficiency);
};

export const shouldRefuel = (
  currentFuel: number,
  fuelCapacity: number,
  distanceToNextStation: number,
  fuelEfficiency: number
): boolean => {
  const remainingRange = calculateRemainingRange(currentFuel, fuelEfficiency);
  const reserveRange = 50; // km
  return remainingRange < distanceToNextStation + reserveRange;
};

export const calculateRefuelCost = (
  currentFuel: number,
  fuelCapacity: number,
  fuelPrice: number
): number => {
  const fuelNeeded = fuelCapacity - currentFuel;
  return Math.round(fuelNeeded * fuelPrice * 100) / 100;
};