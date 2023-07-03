import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

import flightSlice from "./slices/flightSlice";
import statusSlice from "./slices/statusSlice";
import flightOfferReducer from "./slices/flightOfferSlice";

const flightPersistConfig = {
  key: "flight",
  storage,
};

const statusPersistConfig = {
  key: "status",
  storage,
};

const flightOfferPersistConfig = {
  key: "flightOffer",
  storage,
};

const persistedFlightReducer = persistReducer(flightPersistConfig, flightSlice);
const persistedStatusReducer = persistReducer(statusPersistConfig, statusSlice);
const persistedFlightOfferReducer = persistReducer(
  flightOfferPersistConfig,
  flightOfferReducer
);

const logStateMiddleware = (store) => (next) => (action) => {
  return next(action); // Pass the action to the next middleware or the reducer
};

const store = configureStore({
  reducer: {
    flight: persistedFlightReducer,
    status: persistedStatusReducer,
    flightOffer: persistedFlightOfferReducer,
  },
  middleware: [thunk, logStateMiddleware], // Add logStateMiddleware to the middleware array
});

const persistor = persistStore(store);

export { store, persistor };
