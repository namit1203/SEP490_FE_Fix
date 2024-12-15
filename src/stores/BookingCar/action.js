import { createAsyncThunk } from "@reduxjs/toolkit";

const searchTrip = createAsyncThunk(
  "trip/searchTrip",
  async ({ startPoint, endPoint, time }) => {
    let url = `https://boring-wiles.202-92-7-204.plesk.page/api/Trip/searchTrip/startPoint/endPoint/time?startPoint=${startPoint}&endPoint=${endPoint}`;

    if (time) {
      url += `&time=${time}`;
    }

    const response = await fetch(url);

    const data = await response.json();
    return data;
  }
);

const getTripDetailsById = createAsyncThunk(
  "trip/tripDetailById",
  async ({ id }) => {
    let url = `https://boring-wiles.202-92-7-204.plesk.page/api/TripDetails/tripId?TripId=${id}`;

    const response = await fetch(url);

    const data = await response.json();

    return data;
  }
);

const getStartTripDetailsById = createAsyncThunk(
  "trip/startPointID",
  async ({ id }) => {
    let url = `https://boring-wiles.202-92-7-204.plesk.page/api/TripDetails/startPoint/tripId?TripId=${id}`;

    const response = await fetch(url);

    const data = await response.json();

    return data;
  }
);

const getEndTripDetailsById = createAsyncThunk(
  "trip/endPointID",
  async ({ id }) => {
    let url = `https://boring-wiles.202-92-7-204.plesk.page/api/TripDetails/endPoint/tripId?TripId=${id}`;

    const response = await fetch(url);

    const data = await response.json();

    return data;
  }
);

const getCountSeatDetailsById = createAsyncThunk(
  "trip/countseat",
  async ({ id, dateTime }) => {
    let url = `https://boring-wiles.202-92-7-204.plesk.page/api/Vehicle/getNumberSeatAvaiable/${id}/${dateTime}`;

    const response = await fetch(url);

    const data = await response.json();

    return data;
  }
);

const submitReview = createAsyncThunk(
  "trip/submitReview",
  async ({ description, tripId }, { rejectWithValue }) => {
    const url = `https://boring-wiles.202-92-7-204.plesk.page/api/Review`;
    
    try {
      const token = localStorage.getItem('token'); // Get auth token from localStorage
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add auth header
        },
        body: JSON.stringify({
          description,
          tripId
        })
      });

      if (response.status === 401) {
        return rejectWithValue({
          status: 401,
          message: 'Unauthorized access. Please login again.'
        });
      }

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue({
        status: error.status || 500,
        message: error.message || 'Something went wrong'
      });
    }
  }
);

export {
  getEndTripDetailsById,
  getStartTripDetailsById,
  getTripDetailsById,
  searchTrip,
  getCountSeatDetailsById,
  submitReview,
};
