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

export {
  getEndTripDetailsById,
  getStartTripDetailsById,
  getTripDetailsById,
  searchTrip,
  getCountSeatDetailsById,
};
