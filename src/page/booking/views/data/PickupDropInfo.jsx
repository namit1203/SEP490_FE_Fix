import { Spin } from "antd";
import React from "react";
import { useAppSelector } from "../../../../stores/hooks";
import { TripDetailsCard } from "./TripDetailsCard";

export const PickupDropInfo = () => {
  const dataDetails = useAppSelector((state) => state.trips?.tripDetails);
  const isLoadingDetails = useAppSelector(
    (state) => state.trips?.loadingDetails
  );

  if (isLoadingDetails) {
    return (
      <div className="flex justify-center items-center">
        <Spin size="default" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="text-blue-600 font-bold mb-2">Lưu ý</div>
      <div className="mb-4">
        Các mốc thởi gian đón, trả bên dới là thởi gian dự kiến.
        <br />
        Lịch này có thể thay đổi tùy tình hình thực tế.
      </div>
      {dataDetails &&
        dataDetails?.map((item) => (
          <TripDetailsCard key={item.id} item={item} />
        ))}
      <div className="mt-4 text-blue-600">
        <a href="#">Báo cáo sai/thiếu thông tin</a>
      </div>
    </div>
  );
};
