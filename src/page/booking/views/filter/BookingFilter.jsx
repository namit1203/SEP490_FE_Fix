import React from "react";
import TimeFilter from "./timeFilter/TimeFilter";
import GarageFilter from "./garageFilter/GarageFilter";
import PriceFilter from "./priceFilter/PriceFilter";

export default function BookingFilter() {
  return (
    <>
      <div className="w-full gap-4 flex justify-between">
        <p className="font-bold text-lg leading-6 mb-0">Lọc</p>
        <p className="text-sm font-bold leading-5 tracking-[0px] underline underline-offset-1 break-normal mb-0 text-[rgb(36,116,229)] cursor-pointer">
          Xóa lọc
        </p>
      </div>
      {/* time filter */}
      <TimeFilter />
      {/* garage filter */}
      <GarageFilter />
      {/* price filter */}
      <PriceFilter/>
    </>
  );
}
