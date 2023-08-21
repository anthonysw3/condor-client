import { createSlice } from "@reduxjs/toolkit";

const flight = () => {
  return {
    origin: {
      airport: "Heathrow Airport",
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
    filters: {
      onlyWithStatus: true,
      onlyBuildStatus: true,
      stops: [],
      // originDepartTimeEarliest: "",
      // originDepartTimeLatest: "",
      // destinationDepartTimeEarliest: "",
      // destinationDepartTimeLatest: "",
      originDepartTimeRange: [0, 24], // New properties
      destinationDepartTimeRange: [0, 24],
      durationMax: 72,
      durationMin: 0,
      selectedDurationMax: [72],
      layoverMax: 48,
      originAirports: [],
      destinationAirports: [],
      alliances: [],
      airlines: [],
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
    toggleOnlyWithStatus: (state) => {
      state.filters.onlyWithStatus = !state.filters.onlyWithStatus;
    },
    toggleOnlyBuildStatus: (state) => {
      state.filters.onlyBuildStatus = !state.filters.onlyBuildStatus;
    },
    toggleStopsDirect: (state) => {
      if (state.filters.stops.includes(0)) {
        state.filters.stops = state.filters.stops.filter((stop) => stop !== 0);
      } else {
        state.filters.stops.push(0);
      }
    },
    toggleStopsOne: (state) => {
      if (state.filters.stops.includes(1)) {
        state.filters.stops = state.filters.stops.filter((stop) => stop !== 1);
      } else {
        state.filters.stops.push(1);
      }
    },
    toggleStopsTwoPlus: (state) => {
      if (state.filters.stops.includes(2)) {
        state.filters.stops = state.filters.stops.filter((stop) => stop !== 2);
      } else {
        state.filters.stops.push(2);
      }
    },
    setOriginDepartTimeRange: (state, action) => {
      state.filters.originDepartTimeRange = action.payload;
    },
    setDestinationDepartTimeRange: (state, action) => {
      state.filters.destinationDepartTimeRange = action.payload;
    },
    setDurationMax: (state, action) => {
      state.filters.durationMax = action.payload;
    },
    setDurationMin: (state, action) => {
      state.filters.durationMin = action.payload;
    },
    setSelectedDurationMax: (state, action) => {
      console.log("Setting selectedDurationMax:", action.payload);
      state.filters.selectedDurationMax = action.payload;
    },
    setLayoverMax: (state, action) => {
      state.filters.layoverMax = action.payload;
    },
    setOriginAirports: (state, action) => {
      state.filters.originAirports = action.payload.map((airport) => ({
        id: airport,
        selected: true,
      }));
    },
    toggleOriginAirport: (state, action) => {
      const airport = state.filters.originAirports.find(
        (ap) => ap.id === action.payload
      );
      if (airport) airport.selected = !airport.selected;
    },
    setDestinationAirports: (state, action) => {
      state.filters.destinationAirports = action.payload.map((airport) => ({
        id: airport,
        selected: true,
      }));
    },
    toggleDestinationAirport: (state, action) => {
      const airport = state.filters.destinationAirports.find(
        (ap) => ap.id === action.payload
      );
      if (airport) airport.selected = !airport.selected;
    },
    setAlliances: (state, action) => {
      state.filters.alliances = action.payload.map((alliance) => ({
        id: alliance,
        selected: true,
      }));
    },
    toggleAlliance: (state, action) => {
      const alliance = state.filters.alliances.find(
        (al) => al.id === action.payload
      );
      if (alliance) alliance.selected = !alliance.selected;
    },
    setAirlines: (state, action) => {
      state.filters.airlines = action.payload.map((airline) => ({
        id: airline,
        selected: true,
      }));
    },
    toggleAirline: (state, action) => {
      const airline = state.filters.airlines.find(
        (al) => al.id === action.payload
      );
      if (airline) airline.selected = !airline.selected;
    },
  },
});

export const toggleAirline = (iataCode) => (dispatch, getState) => {
  const currentAirlines = getState().flight.filters.airlines;

  const airline = currentAirlines.find((airline) => airline.id === iataCode);

  if (airline) {
    dispatch({
      type: "flight/toggleAirline",
      payload: iataCode,
    });
  } else {
    dispatch(
      setAirlines([...currentAirlines, { id: iataCode, selected: true }])
    );
  }
};
export { flight };
export const {
  setFlightState,
  setOrigin,
  setDestination,
  setDates,
  setTravelClass,
  setPassengers,
  addLoyaltyProgram,
  removeLoyaltyProgram,
  toggleOnlyWithStatus,
  toggleOnlyBuildStatus,
  toggleStopsDirect,
  toggleStopsOne,
  toggleStopsTwoPlus,
  setOriginDepartTimeRange,
  setDestinationDepartTimeRange,
  setDurationMax,
  setDurationMin,
  setSelectedDurationMax,
  setLayoverMax,
  setOriginAirports,
  toggleOriginAirport,
  setDestinationAirports,
  toggleDestinationAirport,
  setAlliances,
  toggleAlliance,
  setAirlines,
} = flightSlice.actions;
export default flightSlice.reducer;
