import { Input } from "antd";
import React, { useState } from "react";
import DropdownIcons from "../../../../../components/icons/dropdown";

export default function GarageFilter() {
  const garageOptions = [
    { id: 1, name: "Xe khách A" },
    { id: 2, name: "Xe khách B" },
    { id: 3, name: "Xe khách C" },
    { id: 4, name: "Xe khách D" },
  ];

  const [isGarageVisible, setIsGarageVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGarages, setFilteredGarages] = useState(garageOptions);
  const [selectedGarages, setSelectedGarages] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = garageOptions.filter((garage) =>
      garage.name.toLowerCase().includes(value)
    );
    setFilteredGarages(filtered);
  };

  const handleGarageSelect = (garage) => {
    if (selectedGarages.some((item) => item.id === garage.id)) {
      setSelectedGarages((prev) =>
        prev.filter((item) => item.id !== garage.id)
      );
    } else {
      setSelectedGarages((prev) => [...prev, garage]);
    }
  };

  return (
    <div className="pb-4 border-b-[rgb(224,224,224)] border-b border-solid">
      <div
        className="flex justify-between cursor-pointer"
        onClick={() => setIsGarageVisible((prev) => !prev)}
      >
        <p className="text-base leading-5 font-bold mb-0">Nhà xe</p>
        <DropdownIcons />
      </div>

      {isGarageVisible && (
        <div className="flex flex-col gap-4 mt-4">
          {/* Input tìm kiếm */}
          <Input
            placeholder="Tìm kiếm nhà xe"
            className="w-full"
            value={searchTerm}
            onChange={handleSearch}
          />

          {/* Danh sách nhà xe */}
          <ul className="bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredGarages.length > 0 ? (
              filteredGarages.map((garage) => (
                <li
                  key={garage.id}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                    selectedGarages.some((item) => item.id === garage.id)
                      ? "bg-blue-100 font-bold"
                      : ""
                  }`}
                  onClick={() => handleGarageSelect(garage)}
                >
                  <span className="text-gray-800 text-sm font-medium">
                    {garage.name}
                  </span>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">Không tìm thấy nhà xe</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
