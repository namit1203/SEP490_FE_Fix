import React, { useState } from "react";
import PlaneIcons from "../../../components/icons/plane";
import StationIcons from "../../../components/icons/station";
import TripIcons from "../../../components/icons/trip";

export default function NavBooking() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuItems = [
    { icon: <TripIcons />, label: "Xe khách" },
    
  ];

  const handleClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <div className="flex justify-center w-full border-b border-b-[#e2e2e2] border-solid">
      {menuItems.map((item, index) => (
        <div
          key={index}
          onClick={() => handleClick(index)}
          className={`h-auto pt-5 pb-3.5 px-6 flex justify-center items-center flex-row gap-2 cursor-pointer border-b-2 border-transparent ${
            selectedIndex === index
              ? "border-b-2 border-b-[rgb(36,116,229)] border-solid"
              : ""
          }`}
        >
          {item.icon}
          <span
            className={`text-base leading-6 ${
              selectedIndex === index
                ? "text-[rgb(36,116,229)] , font-bold"
                : ""
            }`}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
