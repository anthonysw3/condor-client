import { createSlice } from "@reduxjs/toolkit";

const flight = () => {
  return {
    origin: {
      airport: "London",
      name: "London, United Kingdom",
      iata: "LON",
    },
    destination: {
      airport: "",
      name: "",
      iata: "",
    },
    dates: {
      outbound: new Date(),
      inbound: null,
    },
    travelClass: "",
    passengers: {
      adults: 1,
      children: 0,
      infants: 0,
    },
  };
};

const flightSlice = createSlice({
  name: "flight",
  initialState: flight(),
  reducers: {
    setFlightState: (state, action) => {
      return action.payload;
    },
    setOriginAirport: (state, action) => {
      state.origin.airport = action.payload;
    },
    setOriginName: (state, action) => {
      state.origin.name = action.payload;
    },
    setOriginIata: (state, action) => {
      state.origin.iata = action.payload;
    },
    setDestinationAirport: (state, action) => {
      state.destination.airport = action.payload;
    },
    setDestinationName: (state, action) => {
      state.destination.name = action.payload;
    },
    setDestinationIata: (state, action) => {
      state.destination.iata = action.payload;
    },
    setOutboundDate: (state, action) => {
      state.dates.outbound = action.payload;
    },
    setInboundDate: (state, action) => {
      state.dates.inbound = action.payload;
    },
    setTravelClass: (state, action) => {
      state.travelClass = action.payload;
    },
    setPassengers: (state, action) => {
      state.passengers = action.payload;
    },
  },
});

export { flight };
export const {
  setFlightState,
  setOriginAirport,
  setOriginName,
  setOriginIata,
  setDestinationAirport,
  setDestinationName,
  setDestinationIata,
  setOutboundDate,
  setInboundDate,
  setTravelClass,
  setPassengers,
  // Add other action creators here...
} = flightSlice.actions;
export default flightSlice.reducer;
