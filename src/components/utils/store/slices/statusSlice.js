import { createSlice } from "@reduxjs/toolkit";

const initialStatus = [];

const statusSlice = createSlice({
  name: "status",
  initialState: initialStatus,
  reducers: {
    addProgram: (state, action) => {
      if (!Array.isArray(state)) {
        state = [];
      }

      const existingProgram = state.find(
        (program) => program.iataCode === action.payload.iataCode
      );

      if (existingProgram) {
        // If the program exists, update the status
        existingProgram.status = action.payload.status;
      } else {
        // If not, add the new program
        state.push({
          airlineName: action.payload.airlineName,
          iataCode: action.payload.iataCode,
          status: action.payload.status,
        });
      }
    },
    removeProgram: (state, action) => {
      if (!Array.isArray(state)) {
        state = [];
      }
      const programIndex = state.findIndex(
        (program) => program.iataCode === action.payload.iataCode
      );
      if (programIndex !== -1) {
        state.splice(programIndex, 1);
      }
    },
  },
});

export const { addProgram, removeProgram } = statusSlice.actions;
export default statusSlice.reducer;
