export const getTotalPassengers = (state) =>
  state.flight.passengers.adults +
  state.flight.passengers.children +
  state.flight.passengers.infants;
