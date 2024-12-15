import { useEffect } from "react";
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
    if (startPoint && endPoint && time) {
      dispatch(searchTrip({ startPoint, endPoint, time }));
    }
  }, [startPoint, endPoint, time, dispatch]);

  return (
    <div className="divide-y divide-gray-200">
      {/* Search Section */}
      <div className="p-4 sm:p-6 lg:p-8">
        <SearchViews />
      </div>

      {/* Results Section */}
      <div className="p-4 sm:p-6 lg:p-8">
        <DataViews />
      </div>
    </div>
  );
}
