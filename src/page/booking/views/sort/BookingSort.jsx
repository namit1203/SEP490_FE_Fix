import React from "react";

export default function BookingSort({ options }) {
  return (
    <>
      <div className="w-full gap-4 flex flex-col">
        <p className="font-bold text-lg leading-6 mb-0">Sắp xếp</p>
      </div>
      <div className="flex flex-col gap-4">
        {options.map((option) => (
          <label key={option.id} className="flex items-center gap-2">
            <input
              type="radio"
              name="sorting"
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
            <span className="text-sm leading-5 font-semibold">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </>
  );
}
