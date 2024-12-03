import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "./BookingCar/reducer.js";
export const store = configureStore({
  reducer: {
    trips: bookingReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export const getRootState = () => store.getState();
export const appDispatch = (action) => store.dispatch(action);
