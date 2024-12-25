import { message } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  setEndPoint,
  setStartPoint,
  setTime,
} from "../../../stores/BookingCar/reducer";
import { useAppDispatch } from "../../../stores/hooks";

export default function SearchBooking() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // State variables
  const [fromInputValue, setFromInputValue] = useState("");
  const [toInputValue, setToInputValue] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [startOptions, setStartOptions] = useState([]);
  const [endOptions, setEndOptions] = useState([]);

  // Fetch start points
  useEffect(() => {
    const fetchStartOptions = async () => {
      try {
        const response = await axios.get(
          "https://boring-wiles.202-92-7-204.plesk.page/api/Trip/listStartPoint"
        );
        setStartOptions(response.data || []);
        setFromInputValue(response.data?.[0]?.pointStart || ""); // Default start point
      } catch (error) {
        console.error("Failed to fetch start points:", error);
        message.error(t("booking.search.errors.fetchFailed"));
      }
    };

    fetchStartOptions();
  }, [t]);

  // Fetch end points based on selected start point
  const handleStartPointChange = async (selectedStartPoint) => {
    setFromInputValue(selectedStartPoint); // Update start point value

    try {
      const response = await axios.get(
        `https://boring-wiles.202-92-7-204.plesk.page/api/Trip/getListEndPoint/startPoint`,
        {
          params: { startPoint: selectedStartPoint },
        }
      );
      setEndOptions(response.data || []);
      setToInputValue(response.data?.[0]?.name || ""); // Default end point
    } catch (error) {
      console.error("Failed to fetch end points:", error);
      message.error(t("booking.search.errors.fetchFailed"));
    }
  };

  // Handle search
  const handleSearch = () => {
    if (!fromInputValue || !toInputValue || !dateTime) {
      return message.error(t("booking.search.errors.missingFields"));
    }

    const currentTime = new Date();
    if (new Date(dateTime).getTime() < currentTime.getTime()) {
      return message.error(t("booking.search.errors.invalidTime"));
    }

    dispatch(setStartPoint(fromInputValue));
    dispatch(setEndPoint(toInputValue));
    dispatch(setTime(dateTime));
    localStorage.setItem("bookingTime", dateTime);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 justify-between items-center">
          {/* From Location */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("booking.search.from")}
            </label>
            <select
              className="block w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={fromInputValue}
              onChange={(e) => handleStartPointChange(e.target.value)}
            >
              {startOptions.map((option) => (
                <option key={option.id} value={option.pointStart}>
                  {option.pointStart}
                </option>
              ))}
            </select>
          </div>

          {/* To Location */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("booking.search.to")}
            </label>
            <select
              className="block w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={toInputValue}
              onChange={(e) => setToInputValue(e.target.value)}
              disabled={!endOptions.length} // Disable if no end options available
            >
              {endOptions.length ? (
                endOptions.map((option) => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  {t("booking.search.noEndPoint")}
                </option>
              )}
            </select>
          </div>

          {/* Date Time */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("booking.search.date")}
            </label>
            <input
              type="datetime-local"
              className="block w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
          </div>

          {/* Search Button */}
          <div className="md:col-span-3">
            <button
              onClick={handleSearch}
              className="w-full h-[42px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              disabled={!fromInputValue || !toInputValue || !dateTime} // Disable if fields are empty
            >
              {t("booking.search.button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
