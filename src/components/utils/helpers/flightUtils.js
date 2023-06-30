export const getTotalDuration = (slices) => {
  let totalDuration = 0;
  slices.forEach((slice) => {
    slice.segments.forEach((segment) => {
      totalDuration += segment.duration;
    });
  });
  return totalDuration;
};

// Calculate time between flights
export function calculateLayover(prevArrivingAt, nextDepartingAt) {
  const arrivalTime = new Date(prevArrivingAt);
  const departureTime = new Date(nextDepartingAt);
  const diffInHours = Math.abs(departureTime - arrivalTime) / 36e5;
  return diffInHours.toFixed(2);
}
