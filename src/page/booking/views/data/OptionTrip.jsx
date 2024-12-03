import { message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../stores/hooks";

export default function OptionTrip({ data }) {
  const startPointArr = useAppSelector((state) => state.trips?.startPointArr);
  const endPointArr = useAppSelector((state) => state.trips?.endPointArr);
  const countSeat = useAppSelector((state) => state.trips?.countseat);
  const quantity = localStorage.getItem("quantity");
  const navigate = useNavigate();

  const handleTransaction = () => {
    if (countSeat === 0 || quantity > countSeat) {
      return message.error("Không còn chỗ trống cho chuyến xe này!");
    }
    localStorage.setItem("priceTrip", data?.listVehicle[0]?.price);
    navigate("/bookingconfirmation/" + data.id);
  };
  return (
    <>
      <div
        className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 mt-4"
        role="alert"
      >
        <span className="block sm:inline text-sm">
          An tâm được đón đúng nơi, trả đúng chỗ đã chọn và dễ dàng thay đổi khi
          cần.
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <h2 className="font-bold mb-2 text-lg">Điểm đón</h2>
          <div className="text-green-600 text-sm my-2">
            Cách vị trí của bạn 1.5 km
          </div>
          {startPointArr?.map((item, index) => {
            return (
              <div key={index} className="mb-4">
                <input
                  type="radio"
                  id="pickup1"
                  name="pickup"
                  className="mr-2"
                  onChange={(e) => {
                    localStorage.setItem("startTime", item?.timeStartDetils);
                    localStorage.setItem("startPoint", item?.pointStartDetails);
                  }}
                />
                <label>
                  <span className="font-bold">{item?.timeStartDetils}</span> •
                  <span className="font-semibold text-sm">
                    {item?.pointStartDetails}
                  </span>
                </label>
                <div className="text-green-600 text-sm my-2">
                  Cách vị trí của bạn 7.6 km
                </div>
              </div>
            );
          })}
        </div>
        <div className="border p-4 rounded">
          <h2 className="font-bold mb-2 text-lg">Điểm trả</h2>
          <div className="text-green-600 text-sm my-2">
            Cách vị trí của bạn 240.1 km
          </div>
          {endPointArr?.map((item, index) => {
            return (
              <div key={index} className="mb-4">
                <input
                  type="radio"
                  id="pickup2"
                  name="pickup2"
                  className="mr-2"
                  onChange={(e) => {
                    localStorage.setItem("endTime", item?.timeEndDetails);
                    localStorage.setItem("endPoint", item?.pointEndDetails);
                  }}
                />
                <label>
                  <span className="font-bold">{item?.timeEndDetails}</span> •
                  <span className="font-semibold text-sm">
                    {item?.pointEndDetails}
                  </span>
                </label>
                <div className="text-green-600 text-sm my-2">
                  Cách vị trí của bạn 7.6 km
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between mt-4 items-baseline">
        <span className="text-md font-medium">
          Ghế: <span className="text-blue-600 text-md">A3</span>
        </span>

        <span className="text-[rgb(72, 72, 72)] mt-2 text-sm font-medium text-right">
          Còn {countSeat || 0} chỗ
        </span>

        <button
          className="mt-2 px-4 block py-2 bg-blue-400 rounded-none border-none text-sm text-white"
          onClick={handleTransaction}
        >
          Thanh toán
        </button>
      </div>
    </>
  );
}
