import { differenceInMinutes, differenceInHours } from 'date-fns';

export const formatDuration = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (wholeHours === 0) {
    return `${minutes}min`;
  }
  
  return `${wholeHours}h ${minutes}min`;
};

export const shouldTakeBreak = (
  lastRestTime: Date,
  hoursWorked: number
): boolean => {
  const MAX_CONTINUOUS_HOURS = 4.5;
  const MIN_BREAK_DURATION = 45; // minutes
  
  const hoursSinceLastRest = differenceInHours(new Date(), lastRestTime);
  return hoursSinceLastRest >= MAX_CONTINUOUS_HOURS || hoursWorked >= MAX_CONTINUOUS_HOURS;
};

export const calculateNextBreakTime = (
  lastRestTime: Date,
  hoursWorked: number
): Date => {
  const MAX_CONTINUOUS_HOURS = 4.5;
  const nextBreakTime = new Date(lastRestTime);
  nextBreakTime.setHours(nextBreakTime.getHours() + MAX_CONTINUOUS_HOURS);
  return nextBreakTime;
};