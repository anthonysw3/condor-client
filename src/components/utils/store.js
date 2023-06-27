import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

import flightSlice from "./slices/flightSlice";

const persistConfig = {
  key: "root", // Add a key for the root state
  storage,
};

const persistedFlightReducer = persistReducer(persistConfig, flightSlice);

const logStateMiddleware = (store) => (next) => (action) => {
  console.log("Redux state:", store.getState()); // Log the current state
  return next(action); // Pass the action to the next middleware or the reducer
};

const store = configureStore({
  reducer: {
    flight: persistedFlightReducer,
  },
  middleware: [thunk, logStateMiddleware], // Add logStateMiddleware to the middleware array
});

const persistor = persistStore(store);

export { store, persistor };
