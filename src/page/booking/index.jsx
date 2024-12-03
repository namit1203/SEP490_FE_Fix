import React, { Fragment, useEffect } from "react";
import { searchTrip } from "../../stores/BookingCar/action";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import DataViews from "./views/DataViews";
import SearchViews from "./views/SearchViews";
export default function BookingCarViews() {
  const dispatch = useAppDispatch();
  const startPoint = useAppSelector((state) => state.trips.startPoint);
  const endPoint = useAppSelector((state) => state.trips.endPoint);
  const time = useAppSelector((state) => state.trips.time);

  useEffect(() => {
    dispatch(searchTrip({ startPoint, endPoint, time }));
  }, [startPoint, endPoint, time]);

  return (
    <Fragment>
      <SearchViews />
      <DataViews />
    </Fragment>
  );
}
