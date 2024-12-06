import { message } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { options } from "../../../mock/location";
import {
  setEndPoint,
  setStartPoint,
  setTime,
} from "../../../stores/BookingCar/reducer";
import { useAppDispatch } from "../../../stores/hooks";
import DropdownSearch from "./Dropdown";
export default function SearchBooking() {
  const dispatch = useAppDispatch();

  const [fromInputValue, setFromInputValue] = useState(options[0].value);

  const [toInputValue, setToInputValue] = useState(options[1].value);

  const [openDropdown, setOpenDropdown] = useState(null);

  const [dateTime, setDateTime] = useState("");

  const handleChange = (event) => {
    setDateTime(event.target.value);
  };

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

  const handleFromInputClick = () => {
    setOpenDropdown(openDropdown === "from" ? null : "from");
  };

  const handleToInputClick = () => {
    setOpenDropdown(openDropdown === "to" ? null : "to");
  };

  const handleSearch = () => {
    if (!fromInputValue || !toInputValue || !dateTime) {
      return message.error("Vui lòng chọn điểm xuất phát, đích và thời gian");
    }
  
    const currentTime = new Date();
    if (new Date(dateTime).getTime() < currentTime.getTime()) {
      return message.error("Thời gian không hợp lệ");
    }
  
    // Dispatch Redux actions to update the global state
    dispatch(setStartPoint(fromInputValue));
    dispatch(setEndPoint(toInputValue));
    dispatch(setTime(dateTime));
  
    // Save the selected time into localStorage
    localStorage.setItem("bookingTime", dateTime);
  
    message.success("Thông tin đã được lưu thành công");
  };
  
  return (
    <div className="p-4 w-full">
      <div className="flex gap-4">
        <div className="border rounded-lg border-solid border-[rgb(224,224,224)]">
          <div className="flex items-center space-x-4 h-[54px]">
            {/* Start - Nơi xuất phát */}
            <div className="flex flex-row gap-2 px-4 py-0 border-r-[rgb(224,224,224)] border-r border-solid">
              <div className="flex flex-col justify-center items-center">
                <img
                  src="https://229a2c9fe669f7b.cmccloud.com.vn/svgIcon/pickup_vex_blue_24dp.svg"
                  width="24"
                  height="24"
                  alt=""
                />
              </div>
              <div className="flex flex-1 flex-col-reverse justify-around w-full">
                <div ref={fromDropdownRef} className="relative w-full">
                  {/* Input */}
                  <input
                    type="text"
                    className="outline-none !border-none !ring-0 !text-base !p-0 font-semibold"
                    value={fromInputValue}
                    onChange={(e) => {
                      setFromInputValue(e.target.value);
                      setOpenDropdown("from");
                    }}
                    onClick={handleFromInputClick}
                  />

                  {/* Dropdown for "Nơi xuất phát" */}
                  {openDropdown === "from" && (
                    <DropdownSearch
                      filteredOptions={filteredFromOptions}
                      isOpen={true}
                      handleOptionClick={handleFromOptionClick}
                    />
                  )}
                </div>
                <label
                  className="base__Caption-sc-1tvbuqk-26 hTYbup color--light-disable"
                  htmlFor="from_input"
                >
                  Nơi xuất phát
                </label>
              </div>
            </div>

            {/* End - Nơi đến */}
            <div className="flex flex-row gap-2 px-4 py-0">
              <div className="flex flex-col justify-center items-center">
                <img
                  src="https://229a2c9fe669f7b.cmccloud.com.vn/svgIcon/dropoff_new_24dp.svg"
                  width="24"
                  height="24"
                  alt=""
                />
              </div>
              <div className="flex flex-1 flex-col-reverse justify-around w-full">
                <div ref={toDropdownRef} className="relative w-full">
                  {/* Input */}
                  <input
                    type="text"
                    className="outline-none !border-none !ring-0 !text-base !p-0 font-semibold"
                    value={toInputValue}
                    onChange={(e) => {
                      setToInputValue(e.target.value);
                      setOpenDropdown("to");
                    }}
                    onClick={handleToInputClick}
                  />

                  {/* Dropdown for "Nơi đến" */}
                  {openDropdown === "to" && (
                    <DropdownSearch
                      filteredOptions={filteredToOptions}
                      isOpen={true}
                      handleOptionClick={handleToOptionClick}
                    />
                  )}
                </div>
                <label
                  className="base__Caption-sc-1tvbuqk-26 hTYbup color--light-disable"
                  htmlFor="to_input"
                >
                  Nơi đến
                </label>
              </div>
            </div>

            {/* Time - Ngày đi */}
            <div className="flex flex-row gap-2 px-4 py-0 border-l-[rgb(224,224,224)] border-l border-solid">
              <div className="flex flex-col justify-center items-center">
                <img
                  src="https://storage.googleapis.com/fe-production/svgIcon/event_vex_blue_24dp.svg"
                  width="24"
                  height="24"
                  alt=""
                />
              </div>
              <div className="flex flex-1 flex-col-reverse justify-around w-full">
                <div className="relative w-full">
                  {/* Input */}
                  <input
                    type="datetime-local"
                    className="outline-none !border-none !ring-0 !text-base !p-0 font-semibold"
                    value={dateTime}
                    onChange={handleChange}
                  />
                </div>
                <label
                  className="base__Caption-sc-1tvbuqk-26 hTYbup color--light-disable"
                  htmlFor="to_input"
                >
                  Ngày đi
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="grow">
          <button
            onClick={handleSearch}
            data-testid="SearchWidget.search"
            data-tracking-event="search_tickets"
            className="ant-btn DesktopSearchWidgetInterface__ButtonDateStyled-sc-9goqqe-0 DesktopSearchWidgetInterface__ButtonSearchStyled-sc-9goqqe-1 kvbcsM jfbJs button-search ant-btn-block"
          >
            <span>Tìm kiếm</span>
          </button>
        </div>
      </div>
    </div>
  );
}
