import axios from "axios";

export const createCancelToken = () => {
  return axios.CancelToken.source();
};

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

  const source = createCancelToken(); // Localized cancel token for this request

  try {
    const response = await axios.post(
      "http://192.168.0.227:5000/api/search",
      {
        outbound: {
          origin: origin.iata_code,
          destination: destination.iata_code,
          date: outbound,
        },
        returnJourney: inbound
          ? {
              origin: destination.iata_code,
              destination: origin.iata_code,
              date: inbound,
            }
          : null,
        cabin_class: travelClass,
        passengers: passengerArray,
        after: after,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        cancelToken: source.token,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      console.error("Error fetching flight offers:", error);
    }
  }
};

export const fetchSingleFlightOffer = async (offerId) => {
  const source = createCancelToken(); // Localized cancel token for this request

  try {
    const response = await axios.get(
      `http://192.168.0.227:5000/api/book/itinerary/${offerId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cancelToken: source.token,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request was cancelled", error.message);
    } else {
      console.error("Error:", error);
      throw error;
    }
  }
};

// You will need a different approach for the global cancelation,
// since the source isn't global anymore. Depending on your use case,
// you might maintain a list of active sources and cancel them all,
// or reconsider the need for a global cancelation.
