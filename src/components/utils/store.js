import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

import flightSlice from "./slices/flightSlice";
import statusSlice from "./slices/statusSlice";

const flightPersistConfig = {
  key: "flight",
  storage,
};

const statusPersistConfig = {
  key: "status",
  storage,
};

const persistedFlightReducer = persistReducer(flightPersistConfig, flightSlice);
const persistedStatusReducer = persistReducer(statusPersistConfig, statusSlice);

const logStateMiddleware = (store) => (next) => (action) => {
  console.log("Redux state:", store.getState()); // Log the current state
  return next(action); // Pass the action to the next middleware or the reducer
};

const store = configureStore({
  reducer: {
    flight: persistedFlightReducer,
    status: persistedStatusReducer,
  },
  middleware: [thunk, logStateMiddleware], // Add logStateMiddleware to the middleware array
});

const persistor = persistStore(store);

export { store, persistor };
