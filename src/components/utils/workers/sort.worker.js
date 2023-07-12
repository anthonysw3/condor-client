// sort.worker.js

// Helper function to parse ISO 8601 duration to minutes
function parseDuration(isoDuration) {
  // Regex to extract days, hours and minutes
  const daysMatch = isoDuration.match(/(\d+)D/);
  const hoursMatch = isoDuration.match(/(\d+)H/);
  const minutesMatch = isoDuration.match(/(\d+)M/);

  // Parse each unit and if not found, default to 0
  const days = daysMatch ? parseInt(daysMatch[1], 10) : 0;
  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

  // Convert everything to minutes
  return days * 24 * 60 + hours * 60 + minutes;
}

self.onmessage = (e) => {
  console.log("Worker received:", e.data);
  console.log("Worker script loaded");
  try {
    const [method, offers] = e.data;

    let sortedOffers;
    switch (method) {
      case "best":
        sortedOffers = sortOffersByBest(offers);
        break;
      case "price":
        sortedOffers = sortOffersByPrice(offers);
        break;
      case "duration":
        sortedOffers = sortOffersByDuration(offers);
        break;
      default:
        sortedOffers = offers;
        break;
    }

    // Send sorted data back to the main thread
    self.postMessage(sortedOffers); // Send the sorted offers back to the main thread
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};

function sortOffersByBest(offers) {
  return [...offers].sort((a, b) => {
    // If the offer's slice has no segments, default to 0 stops
    const aStops = a.slices.reduce(
      (acc, slice) => acc + (slice.segments ? slice.segments.length : 0),
      0
    );
    const bStops = b.slices.reduce(
      (acc, slice) => acc + (slice.segments ? slice.segments.length : 0),
      0
    );

    return aStops - bStops;
  });
}

function sortOffersByPrice(offers) {
  return [...offers].sort((a, b) => a.total_amount - b.total_amount);
}

function sortOffersByDuration(offers) {
  return [...offers].sort((a, b) => {
    const calculateTotalDuration = (offer) => {
      let totalDuration = 0;
      offer.slices.forEach((slice) => {
        const departureTime = new Date(slice.segments[0].departing_at);
        const arrivalTime = new Date(
          slice.segments[slice.segments.length - 1].arriving_at
        );
        const duration = (arrivalTime - departureTime) / (1000 * 60); // Duration in minutes
        totalDuration += duration;
      });
      return totalDuration;
    };

    const aTotalDuration = calculateTotalDuration(a);
    const bTotalDuration = calculateTotalDuration(b);

    return aTotalDuration - bTotalDuration;
  });
}
