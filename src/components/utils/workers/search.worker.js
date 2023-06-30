self.onmessage = (e) => {
  try {
    console.log("Worker received:", e.data); // Debugging

    const { airportData, searchTerm } = e.data;
    const filteredLocations = airportData.filter((location) => {
      const airportName = location.airport.toLowerCase();
      const locationName = location.name.toLowerCase();
      const iataCode = location.iata.toLowerCase();

      return (
        airportName.includes(searchTerm) ||
        locationName.includes(searchTerm) ||
        iataCode.includes(searchTerm)
      );
    });

    // Send the result back to the main thread
    self.postMessage(filteredLocations);
  } catch (error) {
    console.error("Worker error:", error);
  }
};
