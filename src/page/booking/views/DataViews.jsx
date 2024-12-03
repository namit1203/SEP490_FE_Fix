import React from "react";
import { useAppSelector } from "../../../stores/hooks";
import DataTrip from "./data/DataTrip";
import BookingFilter from "./filter/BookingFilter";
import BookingSort from "./sort/BookingSort";

export default function DataViews() {
  const DataTripStaion = useAppSelector((state) => state.trips?.data);

  const sortingOptions = [
    { id: 1, label: "Mặc định" },
    { id: 2, label: "Giờ đi sớm nhất" },
    { id: 3, label: "Giờ đi muộn nhất" },
    { id: 4, label: "Đánh giá cao nhất" },
    { id: 5, label: "Giá tăng dần" },
    { id: 6, label: "Giá giảm dần" },
  ];

  return (
    <div className="flex w-full gap-2.5 justify-between">
      {/* filter and sort */}
      <div className="flex flex-col gap-4 overflow-hidden w-[266px]">
        {/* sort */}
        <div className="border p-4 rounded-lg border-solid border-[rgb(224,224,224)] flex flex-col gap-4">
          <BookingSort options={sortingOptions} />
        </div>
        {/* filter */}
        <div className="border p-4 rounded-lg border-solid border-[rgb(224,224,224)] flex flex-col gap-4">
          <BookingFilter />
        </div>
      </div>

      {/* data */}
      <div className="w-[730px] flex flex-col gap-5">
        <div className="flex gap-2">
          <p className="text-2xl font-bold leading-8 tracking-[0px] mb-0">
            Kết quả:
          </p>
          <span className="font-bold text-2xl leading-8 tracking-[-0.5px]">
            {DataTripStaion?.length || 0} chuyến
          </span>
        </div>
        <DataTrip />
      </div>
    </div>
  );
}
