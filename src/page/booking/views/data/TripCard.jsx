import { Tabs } from "antd";
import React from "react";
import {
  getCountSeatDetailsById,
  getEndTripDetailsById,
  getStartTripDetailsById,
  getTripDetailsById,
} from "../../../../stores/BookingCar/action";
import { useAppDispatch, useAppSelector } from "../../../../stores/hooks";
import { ImageGallery } from "./ImageGallery";
import OptionTrip from "./OptionTrip";
import { PickupDropInfo } from "./PickupDropInfo";
import { PolicyDetails } from "./PolicyDetails";
import SelectTrip from "./SelectTrip";

export const TripCard = ({
  index,
  selectedTrip,
  setSelectedTrip,
  activeCardIndex,
  setActiveCardIndex,
  data,
}) => {
  const dispatch = useAppDispatch();
  const [showOptionTrip, setShowOptionTrip] = React.useState(false);
  const DateTripStaion = useAppSelector((state) => state?.trips?.time);

  const handleOpenDetailsTrip = (id, index) => {
    if (activeCardIndex !== index) {
      dispatch(getTripDetailsById({ id }));
      setActiveCardIndex(index);
    }
  };

  const handleCloseDetailsTrip = () => {
    setActiveCardIndex(null);
  };
  const handleSelectTrip = (index) => {
    setSelectedTrip((prev) => {
      const isCurrentlySelected = prev[index];

      if (isCurrentlySelected) {
        setShowOptionTrip(false);
      }

      return {
        ...prev,
        [index]: !isCurrentlySelected,
      };
    });
  };

  const handleContinue = React.useCallback(async () => {
    try {
      setShowOptionTrip(true);
      await Promise.all([
        dispatch(getStartTripDetailsById({ id: data?.id })),
        dispatch(getEndTripDetailsById({ id: data?.id })),
        dispatch(
          getCountSeatDetailsById({ id: data?.id, dateTime: DateTripStaion })
        ),
      ]);
    } catch (error) {
      console.error("Error fetching trip details:", error);
    }
  }, []);

  const tabItems = [
    {
      key: "2",
      label: "Đón/trả",
      children: <PickupDropInfo />,
    },
    {
      key: "4",
      label: "Chính sách",
      children: <PolicyDetails />,
    },
    {
      key: "5",
      label: "Hình ảnh",
      children: <ImageGallery />,
    },
    {
      key: "6",
      label: "Review",
      children: <div>{/* <ReviewComponent /> */}</div>,
    },
  ];

  return (
    <div className="border rounded-lg p-4 shadow-md mb-4">
      <div className="flex justify-between">
        <section>
          <h3 className="font-bold text-lg capitalize">{data?.fullName}</h3>
          <p className="text-sm">{data?.description}</p>
          <p className="text-sm mt-2">
            {data?.startTime} - {data?.pointStart}
          </p>
          <p className="text-sm">{data?.pointEnd}</p>
        </section>
        <section>
          <span className="block font-bold text-lg text-blue-500 text-right">
            Từ {data?.listVehicle[0]?.price?.toLocaleString()}đ
          </span>
          <p className="text-[rgb(72, 72, 72)] mt-2 text-sm font-medium text-right">
            Xe {data?.listVehicle[0]?.numberSeat} chỗ
          </p>
          <div className="flex items-baseline gap-3 justify-between">
            <p
              className="text-sm mb-0 text-blue-600 underline cursor-pointer"
              onClick={
                activeCardIndex === index
                  ? handleCloseDetailsTrip
                  : () => handleOpenDetailsTrip(data?.id, index)
              }
            >
              {activeCardIndex === index ? "Ẩn chi tiết" : "Thông tin chi tiết"}
            </p>
            <button
              className="mt-2 px-4 block py-2 bg-yellow-400 rounded-none border-none text-sm text-gray-700"
              onClick={() => handleSelectTrip(index)}
            >
              {selectedTrip[index] ? "Đóng" : "Chọn chuyến"}
            </button>
          </div>
          <div className="text-right text-sm text-gray-600 mt-4 font-medium">
            Biển số xe : {data?.listVehicle[0]?.licensePlate}
          </div>
        </section>
      </div>
      {activeCardIndex === index && (
        <Tabs defaultActiveKey="1" items={tabItems} />
      )}
      {selectedTrip[index] && !showOptionTrip && (
        <SelectTrip data={data} onContinue={handleContinue} />
      )}
      {selectedTrip[index] && showOptionTrip && <OptionTrip data={data} />}
    </div>
  );
};
