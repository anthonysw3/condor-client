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
    loyaltyPrograms: [], // New initial state key for loyalty programs
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
    addLoyaltyProgram: (state, action) => {
      state.loyaltyPrograms.push(action.payload);
    },
    removeLoyaltyProgram: (state, action) => {
      const index = state.loyaltyPrograms.findIndex(
        (program) => program.iata_code === action.payload.iata_code
      );
      if (index !== -1) {
        state.loyaltyPrograms.splice(index, 1);
      }
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
  addLoyaltyProgram, // Export new action
  removeLoyaltyProgram, // Export new action
} = flightSlice.actions;
export default flightSlice.reducer;
