import { Input } from "antd";
import React from "react";
import IconsSeat from "../../../../components/icons/seat";

export default function SelectTrip({ data, onContinue }) {
  return (
    <>
      <div className="w-full">
        <h2 className="font-bold text-lg">Chú thích</h2>
        <div className="flex items-center mb-2 w-full">
          <div
            className="SeatThumbnail__SeatContainer-sc-1ooosi9-0 daMVvn seat-thumbnail"
            disabled
          >
            <IconsSeat />
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              placeholder="Nhập số lượng ghế"
              onChange={(e) => {
                localStorage.setItem("quantity", e.target.value);
              }}
            />
            <label className="font-medium text-sm whitespace-nowrap">
              Số lượng ghế
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          <span className="text-md font-medium">
            Ghế: <span className="text-blue-600 text-md">A3</span>
          </span>
        </div>
        <div className="flex flex-col">
          <span>
            Tổng cộng:
            <span className="font-bold text-blue-600 ml-1">
              {data?.listVehicle[0]?.price?.toLocaleString()}đ
            </span>
          </span>
          <button
            className="mt-2 px-4 block py-2 bg-blue-400 rounded-none border-none text-sm text-white"
            onClick={onContinue}
          >
            Đặt chuyến
          </button>
        </div>
      </div>
    </>
  );
}
