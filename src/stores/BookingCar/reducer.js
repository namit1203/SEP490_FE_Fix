import { createSlice } from "@reduxjs/toolkit";
import {
  getCountSeatDetailsById,
  getEndTripDetailsById,
  getStartTripDetailsById,
  getTripDetailsById,
  searchTrip,
} from "./action";

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    data: [],
    tripDetails: [],
    promotions: [],
    loadingPromotions: false,
    loadingDeitals: false,
    loading: false,
    error: null,
    startPoint: "Hà Nội",
    endPoint: "",
    time: "2024-11-12",
    startPointArr: [],
    endPointArr: [],
    countseat: 0,
  },
  reducers: {
    setStartPoint: (state, action) => {
      state.startPoint = action.payload;
    },
    setEndPoint: (state, action) => {
      state.endPoint = action.payload;
    },
    setTime: (state, action) => {
      state.time = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // search
      .addCase(searchTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })

      .addCase(searchTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // detail by id
      .addCase(getTripDetailsById.pending, (state) => {
        state.loadingDeitals = true;
        state.error = null;
      })
      .addCase(getTripDetailsById.fulfilled, (state, action) => {
        state.loadingDeitals = false;
        state.tripDetails = action.payload;
      })
      .addCase(getTripDetailsById.rejected, (state, action) => {
        state.loadingDeitals = false;
        state.error = action.error.message;
      })

      // startpoint
      .addCase(getStartTripDetailsById.pending, (state) => {
        state.loadingDeitals = true;
        state.error = null;
      })
      .addCase(getStartTripDetailsById.fulfilled, (state, action) => {
        state.loadingDeitals = false;
        state.startPointArr = action.payload;
      })

      // endpoint
      .addCase(getEndTripDetailsById.pending, (state) => {
        state.loadingDeitals = true;
        state.error = null;
      })
      .addCase(getEndTripDetailsById.fulfilled, (state, action) => {
        state.loadingDeitals = false;
        state.endPointArr = action.payload;
      })

      //countseat
      .addCase(getCountSeatDetailsById.pending, (state) => {
        state.loadingDeitals = true;
        state.error = null;
      })
      .addCase(getCountSeatDetailsById.fulfilled, (state, action) => {
        state.loadingDeitals = false;
        state.countseat = action.payload;
      });
  },
});

export const { setStartPoint, setEndPoint, setTime } = bookingSlice.actions;
export default bookingSlice.reducer;
