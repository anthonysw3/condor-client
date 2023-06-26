import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import flightSlice from "./slices/flightSlice";

const persistConfig = {
  key: "root", // Add a key for the root state
  storage,
};

const persistedFlightReducer = persistReducer(persistConfig, flightSlice);

const store = configureStore({
  reducer: {
    flight: persistedFlightReducer,
  },
});

const persistor = persistStore(store);

export { store, persistor };
