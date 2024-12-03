import React from "react";
import NavBooking from "../modules/NavBooking";
import SearchBooking from "../modules/SearchBooking";

export default function SearchViews() {
  return (
    <div className="bg-white border border-gray-50 rounded-lg shadow">
      <NavBooking />
      <SearchBooking />
    </div>
  );
}
