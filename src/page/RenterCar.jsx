import React, { useContext, useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { message } from "antd";
import axios from "axios";
import { checkLoginToken } from "../utils";
import { AppContext } from "../context/app.context";

const RenterCar = () => {
  const { profile } = useContext(AppContext);

  const [dataDetail, setDataDetail] = useState({
    startLocation: "Ha Noi",
    endLocation: "Bac Giang",
    startTime: "",
    endTime: "",
    seats: "7", // Mặc định chọn loại 7 chỗ
  });

  const handelSubmit = async () => {
    try {
      const dataPayload = {
        startLocation: dataDetail.startLocation,
        endLocation: dataDetail.endLocation,
        startTime: dataDetail.startTime,
        endTime: dataDetail.endTime,
        seats: parseInt(dataDetail.seats, 10),
      };

      await axios.post(
        "https://boring-wiles.202-92-7-204.plesk.page/CreateTicketForRentFullCar",
        dataPayload,
        {
          headers: {
            Authorization: `Bearer ${checkLoginToken()}`,
          },
        }
      );

      message.success("Thành công, chúng tôi sẽ liên hệ lại với bạn!");
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      message.error("Thất bại, vui lòng thử lại!");
    }
  };

  return (
    <div>
      <Header />
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto p-4">
          <div className="flex">
            <div className="w-3/5 bg-white p-4 shadow-lg">
              <div className="mb-4">
                <label>Điểm đi</label>
                <input
                  type="text"
                  value={dataDetail.startLocation}
                  onChange={(e) =>
                    setDataDetail({ ...dataDetail, startLocation: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Nhập địa chỉ nơi đi"
                />
              </div>
              <div className="mb-4">
                <label>Điểm đến</label>
                <input
                  type="text"
                  value={dataDetail.endLocation}
                  onChange={(e) =>
                    setDataDetail({ ...dataDetail, endLocation: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Nhập địa chỉ nơi đến"
                />
              </div>
              <div className="mb-4">
                <label>Thời gian đi</label>
                <input
                  type="datetime-local"
                  value={dataDetail.startTime}
                  onChange={(e) =>
                    setDataDetail({ ...dataDetail, startTime: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label>Thời gian về</label>
                <input
                  type="datetime-local"
                  value={dataDetail.endTime}
                  onChange={(e) =>
                    setDataDetail({ ...dataDetail, endTime: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label>Chọn loại xe (số ghế)</label>
                <select
                  value={dataDetail.seats}
                  onChange={(e) =>
                    setDataDetail({ ...dataDetail, seats: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="7">Ghế ngồi 7 chỗ</option>
                  <option value="16">Ghế ngồi 16 chỗ</option>
                  <option value="29">Ghế ngồi 29 chỗ</option>
                  <option value="45">Ghế ngồi 45 chỗ</option>
                </select>
              </div>
              <button
                onClick={handelSubmit}
                className="bg-green-500 text-white py-2 px-4 rounded-full w-full"
              >
                ĐẶT XE NGAY
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RenterCar;
