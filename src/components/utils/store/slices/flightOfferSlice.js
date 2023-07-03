// flightOfferSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const flightOfferSlice = createSlice({
  name: "flightOffer",
  initialState: {
    id: "",
  },
  reducers: {
    setFlightOfferId: (state, action) => {
      state.id = action.payload;
    },
  },
});

export const { setFlightOfferId } = flightOfferSlice.actions;

export default flightOfferSlice.reducer;
