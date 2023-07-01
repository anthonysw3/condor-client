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

// Get the duration in minutes
function getDurationInMinutes(duration) {
  const regex = /PT(\d{1,2})H(\d{1,2})?M?/;
  const match = duration.match(regex);

  if (match) {
    let [, hours, minutes] = match;
    hours = Number(hours) || 0;
    minutes = Number(minutes) || 0;
    return hours * 60 + minutes;
  } else {
    console.log("No match found for regex in the provided duration");
    return 0;
  }
}
