// Get flight offers from Duffel API
export const fetchFlightOffers = async ({
  origin,
  destination,
  outbound,
  inbound,
  travelClass,
  adults,
  children,
  infants,
  after,
}) => {
  const passengerArray = [];

  for (let i = 0; i < adults; i++) {
    passengerArray.push({ age: 21 });
  }

  for (let i = 0; i < children; i++) {
    passengerArray.push({ age: 12 });
  }

  for (let i = 0; i < infants; i++) {
    passengerArray.push({ age: 1 });
  }

  console.log(passengerArray);

  try {
    const response = await fetch("http://192.168.0.227:5000/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        outbound: {
          origin: origin.iata,
          destination: destination.iata,
          date: outbound,
        },
        returnJourney: inbound
          ? {
              origin: destination.iata,
              destination: origin.iata,
              date: inbound,
            }
          : null,
        cabin_class: travelClass,
        passengers: passengerArray,
        after: after,
      }),
    });

    const responseData = await response.json();
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Get single flight offer from Duffel API
export const fetchSingleFlightOffer = async (offerId) => {
  try {
    const response = await fetch(
      `http://192.168.0.227:5000/api/book/itinerary/${offerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
