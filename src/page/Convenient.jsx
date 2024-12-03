import React, { useContext, useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { message } from "antd";
import axios from "axios";
import { checkLoginToken } from "../utils";
import { AppContext } from "../context/app.context";

const Convenient = () => {
  const { profile } = useContext(AppContext);

  const [dataDetail, setDataDetail] = useState({
    startPoint: "Ha Noi",
    endPoint: "Bac Giang",
    startTime: "",
  });
  const [price, setPrice] = useState(null); // Original price (Giá 1)
  const [finalPrice, setFinalPrice] = useState(null); // Discounted price (Giá 2)
  const [selectedService, setSelectedService] = useState("ConvenientTrip");
  const [promotions, setPromotions] = useState([]); // List of promotions
  const [selectedPromotion, setSelectedPromotion] = useState(null); // Selected promotion
  const [phoneNumber, setPhoneNumber] = useState(profile?.numberPhone || "");

  // Fetch promotions on component mount
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const { data } = await axios.get(
          `https://boring-wiles.202-92-7-204.plesk.page/api/Promotion/getPromotionById`,
          {
            headers: {
              Authorization: `Bearer ${checkLoginToken()}`,
            },
          }
        );

        const uniquePromotions = Array.from(
          new Map(data.map((promo) => [promo.codePromotion, promo])).values()
        );
        setPromotions(uniquePromotions);
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
        message.error("Không thể tải danh sách khuyến mãi.");
      }
    };

    fetchPromotions();
  }, []);

  // Fetch the price for the trip
  const handelBookTrip = async () => {
    const tripType = selectedService === "ConvenientTrip" ? 2 : 3;
    try {
      const { data } = await axios.get(
        `https://boring-wiles.202-92-7-204.plesk.page/api/Trip/searchTripForConvenient/${dataDetail.startPoint}/${dataDetail.endPoint}/${tripType}`,
        {
          headers: {
            Authorization: `Bearer ${checkLoginToken()}`,
          },
        }
      );

      if (data?.price) {
        setPrice(data.price);
        setFinalPrice(null); // Reset final price when fetching a new trip
        message.success("Đã cập nhật giá chuyến đi.");
      }
    } catch (error) {
      console.error("Error fetching trip price:", error);
      message.error("Không thể tìm thấy giá chuyến đi.");
    }
  };

  // Apply promotion to calculate the final price
  const handleApplyPromotion = () => {
    if (!price) {
      message.warning("Vui lòng kiểm tra giá trước khi áp dụng khuyến mãi.");
      return;
    }

    if (selectedPromotion) {
      const selectedPromo = promotions.find(
        (promo) => promo.codePromotion === selectedPromotion
      );

      if (!selectedPromo) {
        message.warning("Khuyến mãi không hợp lệ.");
        return;
      }

      const discount = selectedPromo.discount || 0;
      const discountedPrice = price - (price * discount) / 100;
      setFinalPrice(discountedPrice);

      message.success(`Khuyến mãi đã áp dụng: ${selectedPromo.description}`);
    } else {
      setFinalPrice(price); // If no promotion is selected, use the original price
      message.info("Không áp dụng khuyến mãi.");
    }
  };

  // Handle trip booking
  const handelResult = async () => {
    if (!finalPrice) {
      message.warning("Vui lòng áp dụng khuyến mãi trước khi đặt xe.");
      return;
    }

    try {
      const dataPayload = {
        userName: profile?.username,
        startTime: dataDetail?.startTime,
        price: finalPrice,
        pointStart: dataDetail?.startPoint,
        pointEnd: dataDetail?.endPoint,
        pickUpPoint: dataDetail?.pickUpPoint,
        dropOffPoint: dataDetail?.dropOffPoint,
        phoneNumber: phoneNumber,
        typeOfTrip: selectedService === "ConvenientTrip" ? 2 : 3,
      };
      await axios.post(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Request/ConvenientTripCreateForUser",
        dataPayload,
        {
          headers: {
            Authorization: `Bearer ${checkLoginToken()}`,
          },
        }
      );
      message.success("Thành công , chúng tôi sẽ liên hệ lại bạn !");
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (error) {
      console.error(error);
      message.error("Thất bại , vui lòng thử lại !");
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
                <label>Chọn dịch vụ</label>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="datxe_dichvu"
                      value="ConvenientTrip"
                      checked={selectedService === "ConvenientTrip"}
                      onChange={(e) => setSelectedService(e.target.value)}
                    />
                    Tiện chuyến
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="datxe_dichvu"
                      value="PrivateTrip"
                      checked={selectedService === "PrivateTrip"}
                      onChange={(e) => setSelectedService(e.target.value)}
                    />
                    Bao xe
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label>Điểm đi</label>
                <input
                  type="text"
                  value={dataDetail.startPoint}
                  onChange={(e) =>
                    setDataDetail({ ...dataDetail, startPoint: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label>Điểm đến</label>
                <input
                  type="text"
                  value={dataDetail.endPoint}
                  onChange={(e) =>
                    setDataDetail({ ...dataDetail, endPoint: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label>Thời gian</label>
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
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <button
                  onClick={handelBookTrip}
                  className="bg-blue-500 text-white py-2 px-4 rounded-full"
                >
                  Tìm vé
                </button>
              </div>
              {price !== null && (
                <div className="mb-4">
                  <p>Giá gốc: {`${price}đ`}</p>
                </div>
              )}
              <div className="mb-4">
                <label>Chọn khuyến mãi</label>
                <select
                  value={selectedPromotion}
                  onChange={(e) => setSelectedPromotion(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">-- Chọn khuyến mãi --</option>
                  {promotions.map((promo) => (
                    <option
                      key={promo.codePromotion}
                      value={promo.codePromotion}
                    >
                      {promo.codePromotion} - Giảm {promo.discount}%
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleApplyPromotion}
                  className="bg-blue-500 text-white py-2 px-4 mt-2 rounded-full w-full"
                >
                  Áp dụng khuyến mãi
                </button>
              </div>
              {finalPrice !== null && (
                <div className="mb-4">
                  <p>
                    Giá gốc:{" "}
                    <span className="line-through text-gray-500">{`${price}đ`}</span>
                  </p>
                  <p>
                    Giá sau khuyến mãi:{" "}
                    <span className="text-green-500">{`${finalPrice}đ`}</span>
                  </p>
                </div>
              )}
              <button
                onClick={handelResult}
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

export default Convenient;
