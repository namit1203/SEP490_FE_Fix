import React, { useState } from "react";
import DropdownIcons from "../../../../../components/icons/dropdown";

export default function TimeFilter() {
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("24:00");
  const [isTimeRangeVisible, setIsTimeRangeVisible] = useState(false);
  return (
    <div className="pb-4 border-b-[rgb(224,224,224)] border-b border-solid">
      <div
        className="flex justify-between cursor-pointer"
        onClick={() => setIsTimeRangeVisible((prev) => !prev)}
      >
        <p className="text-base leading-5 font-bold mb-0">Giờ đi</p>
        <DropdownIcons />
      </div>
      {/* Time Range Input */}
      {isTimeRangeVisible && (
        <div className="flex justify-between items-center mt-4">
          <div
            className="flex flex-col items-center border-gray-300 rounded-md
          border-solid border"
          >
            <label className="text-xs text-gray-500 font-semibold">Từ</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full text-center px-1 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold"
            />
          </div>
          <span className="mx-2">-</span>
          <div
            className="flex flex-col items-center border-gray-300 rounded-md
          border-solid border"
          >
            <label className="text-xs text-gray-500 font-semibold">Đến</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full text-center px-1 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold"
            />
          </div>
        </div>
      )}
    </div>
  );
}
