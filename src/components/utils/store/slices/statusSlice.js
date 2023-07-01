import { createSlice } from "@reduxjs/toolkit";

const initialStatus = [];

const statusSlice = createSlice({
  name: "status",
  initialState: initialStatus,
  reducers: {
    addProgram: (state, action) => {
      console.log("state before push: ", state);
      state.push(action.payload);
    },
    removeProgram: (state, action) => {
      const programIndex = state.findIndex(
        (program) => program.name === action.payload.airline
      );
      if (programIndex !== -1) {
        state.splice(programIndex, 1);
      }
    },
  },
});

export const { addProgram, removeProgram } = statusSlice.actions;
export default statusSlice.reducer;