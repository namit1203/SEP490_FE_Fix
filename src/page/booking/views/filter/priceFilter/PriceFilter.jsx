import { Slider } from "antd";
import React, { useState } from "react";
import DropdownIcons from "../../../../../components/icons/dropdown";

export default function PriceFilter() {
  const [isPriceFilter, setIsPriceFilter] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000000]);

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };
  return (
    <div className="pb-4 border-b-[rgb(224,224,224)] border-b border-solid">
      <div
        className="flex justify-between cursor-pointer"
        onClick={() => setIsPriceFilter((prev) => !prev)}
      >
        <p className="text-base leading-5 font-bold mb-0">Giá vé</p>
        <DropdownIcons />
      </div>

      {isPriceFilter && (
        <div className="flex flex-col gap-4 mt-4">
          <Slider
            range
            min={0}
            max={2000000}
            step={10000}
            value={priceRange}
            onChange={handlePriceChange}
            tooltip={{
              formatter: (value) => `${value.toLocaleString("vi-VN")} đ`,
            }}
          />
          <div className="flex justify-between text-sm font-semibold">
            <span>{`${priceRange[0].toLocaleString("vi-VN")} đ`}</span>
            <span>{`${priceRange[1].toLocaleString("vi-VN")} đ`}</span>
          </div>
        </div>
      )}
    </div>
  );
}
