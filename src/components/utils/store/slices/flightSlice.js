import { createSlice } from "@reduxjs/toolkit";

const flight = () => {
  return {
    origin: {
      airport: "London Heathrow",
      name: "London",
      country: "United Kingdom",
      iata_code: "LHR",
    },
    destination: {
      airport: "",
      name: "",
      country: "",
      iata_code: "",
    },
    dates: {
      outbound: null,
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
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setDates: (state, action) => {
      state.dates = action.payload;
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
  setOrigin,
  setDestination,
  setDates,
  setTravelClass,
  setPassengers,
} = flightSlice.actions;
export default flightSlice.reducer;
