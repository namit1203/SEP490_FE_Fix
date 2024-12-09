import { message } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import { FiMapPin, FiCalendar, FiSearch } from 'react-icons/fi';
import { options } from "../../../mock/location";
import {
  setEndPoint,
  setStartPoint,
  setTime,
} from "../../../stores/BookingCar/reducer";
import { useAppDispatch } from "../../../stores/hooks";
import DropdownSearch from "./Dropdown";

export default function SearchBooking() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [fromInputValue, setFromInputValue] = useState(options[0].value);
  const [toInputValue, setToInputValue] = useState(options[1].value);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dateTime, setDateTime] = useState("");

  const fromDropdownRef = useRef(null);
  const toDropdownRef = useRef(null);

  const filteredFromOptions = options.filter((option) =>
    option.value.toLowerCase().includes(fromInputValue.toLowerCase())
  );

  const filteredToOptions = options.filter((option) =>
    option.value.toLowerCase().includes(toInputValue.toLowerCase())
  );

  const handleFromOptionClick = (option) => {
    setFromInputValue(option.value);
    setOpenDropdown(null);
  };

  const handleToOptionClick = (option) => {
    setToInputValue(option.value);
    setOpenDropdown(null);
  };

  const handleClickOutside = useCallback((event) => {
    if (
      fromDropdownRef.current &&
      !fromDropdownRef.current.contains(event.target) &&
      toDropdownRef.current &&
      !toDropdownRef.current.contains(event.target)
    ) {
      setOpenDropdown(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleSearch = () => {
    if (!fromInputValue || !toInputValue || !dateTime) {
      return message.error(t('booking.search.errors.missingFields'));
    }
  
    const currentTime = new Date();
    if (new Date(dateTime).getTime() < currentTime.getTime()) {
      return message.error(t('booking.search.errors.invalidTime'));
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
            <div className="relative" ref={fromDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('booking.search.from')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={fromInputValue}
                  onChange={(e) => {
                    setFromInputValue(e.target.value);
                    setOpenDropdown("from");
                  }}
                  onClick={() => setOpenDropdown("from")}
                  placeholder={t('booking.search.fromPlaceholder')}
                />
              </div>
              {openDropdown === "from" && (
                <DropdownSearch
                  filteredOptions={filteredFromOptions}
                  isOpen={true}
                  handleOptionClick={handleFromOptionClick}
                />
              )}
            </div>
          </div>

          {/* To Location */}
          <div className="md:col-span-3">
            <div className="relative" ref={toDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('booking.search.to')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={toInputValue}
                  onChange={(e) => {
                    setToInputValue(e.target.value);
                    setOpenDropdown("to");
                  }}
                  onClick={() => setOpenDropdown("to")}
                  placeholder={t('booking.search.toPlaceholder')}
                />
              </div>
              {openDropdown === "to" && (
                <DropdownSearch
                  filteredOptions={filteredToOptions}
                  isOpen={true}
                  handleOptionClick={handleToOptionClick}
                />
              )}
            </div>
          </div>

          {/* Date Time */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('booking.search.date')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="datetime-local"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-transparent mb-1">
              {t('booking.search.action')}
            </label>
            <button
              onClick={handleSearch}
              className="w-full h-[42px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <FiSearch className="w-5 h-6" />
              <span>{t('booking.search.button')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
