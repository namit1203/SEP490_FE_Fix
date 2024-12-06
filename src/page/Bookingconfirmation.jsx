import { message } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/app.context";
import { checkLoginToken } from "../utils";
import CountdownTimer from "./CountdownTimer";
import Header from "./Header";

const Bookingconfirmation = () => {
  const navigate = useNavigate();
  const { profile } = useContext(AppContext);
  const { id } = useParams();
  const [promotion, setPromotion] = useState([]);
  const [promotionId, setPromotionId] = useState([]);
  const [ticketId, setTicketId] = useState(null);
  const [randomCode, setRandomCode] = useState(null);
  const quantity = localStorage.getItem("quantity");
  const [countDown, setCountDown] = useState(false);
  const [checkSelectPromtion, setCheckSelectPromtion] = useState(null);
  const [checkQr, setCheckQr] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const handelFetchData = async () => {
    const { data } = await axios.get(
      "https://boring-wiles.202-92-7-204.plesk.page/api/Promotion",
      {
        headers: {
          Authorization: "Bearer " + checkLoginToken(),
        },
      }
    );
    const currentDate = new Date();
    const validPromotions = data.filter(
      (item) => new Date(item.endDate) > currentDate
    );
    setPromotion(validPromotions);
  };
  const handelFetchDataTipDetails = async () => {
    const { data } = await axios.get(
      "https://boring-wiles.202-92-7-204.plesk.page/api/TripDetails/tripId?TripId=" +
        localStorage.getItem("tripId"),
      {
        headers: {
          Authorization: "Bearer " + checkLoginToken(),
        },
      }
    );
   // console.log("promotionId", data);
    setPromotionId(data);
   // console.log(promotionId)
  };
  useEffect(() => {
    handelFetchData();
    handelFetchDataTipDetails();
  }, []);
  const handelBookTrip = async () => {
    try {
      // Check if "pay-on-bus" and quantity > 1
      if (selectedPayment === "pay-on-bus" && Number(quantity) > 1) {
        return message.error("Đối với thanh toán tiền mặt chỉ được phép đặt 1 vé");
      }
  
      // Retrieve bookingTime from localStorage
      const storedBookingTime = localStorage.getItem("bookingTime");
  
      if (!storedBookingTime) {
        return message.error("Thời gian đặt vé không tồn tại. Vui lòng kiểm tra lại.");
      }
  
      // Extract only the date (YYYY-MM-DD) from storedBookingTime
      const bookingDate = storedBookingTime.split("T")[0];
  
      // Generate a random code
      const generateRandomCode = () => {
        const randomNumbers = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit code
        return randomNumbers.toString();
      };
  
      const randomCodeGenerated = generateRandomCode();
      setRandomCode(randomCodeGenerated); // Save the generated random code
  
      // Construct the new API endpoint
      const apiUrl = `https://boring-wiles.202-92-7-204.plesk.page/api/Ticket/bookTicket/${id}/${bookingDate}?numberTicket=${quantity}&promotionCode=${checkSelectPromtion}`;
  
      const response = await axios.post(
        apiUrl,
        { note: "string", typeOfPayment: 2 },
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );
  
      // Save ticket ID
      setTicketId(response.data.ticketId);
  
      // Redirect to ticket detail if pay-on-bus
      if (selectedPayment === "pay-on-bus") {
        message.success("Thanh toán khi lên xe đã được xác nhận!");
        return navigate(`/ticket-detail/${response.data.ticketId}`);
      }
  
      // For other payment methods, proceed with QR code handling
      setCheckQr(true);
    } catch (error) {
      console.log(error);
      message.error("Đã xảy ra lỗi khi đặt vé");
    }
  };
  
  
  
  const getImgSrc = () => {
    const totalAmount =
      Number(localStorage.getItem("priceTrip")) *
      Number(localStorage.getItem("quantity"));
    const accountNameTK = "Le Son Nam";
    const descriptionn = `${profile?.username}${randomCode}`;
  
    const bankId = "970415";
    const accountNo = "108881732352";
    const template = "print";

    return {
      url: `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${totalAmount}&addInfo=${descriptionn}&accountName=${accountNameTK}`,
      // url: `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${totalAmount}&addInfo=<DESCRIPTION>&accountName=<ACCOUNT_NAME>`
    };
  };

  const discounts = promotion;
  const handelTranferQr = async () => {
    try {
      const totalAmount =
        Number(localStorage.getItem("priceTrip")) *
        Number(localStorage.getItem("quantity"));
      const descriptionn = `${profile?.username}${randomCode}`;
  
      const postPayment = await axios.post(
        `https://boring-wiles.202-92-7-204.plesk.page/api/Payment?amout=${totalAmount}&description=${descriptionn}&codePayment=${randomCode}&ticketID=${ticketId}&typePayment=1&email=${profile?.email}`,
        null,
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );
  
      // Payment successful
      message.success("Thanh toán Thành công !");
      setTimeout(() => {
        navigate(`/ticket-detail/${ticketId}`); // Redirect to ticket-detail with ticketId
      }, 1500);
  
      console.log(postPayment, "postPayment");
    } catch (error) {
      // Payment failed
      message.error("Thanh toán thất bại, vui lòng liên hệ bộ phận hỗ trợ!");
      setTimeout(() => {
        navigate(`/ticket-detail/${ticketId}`, {
          state: { error: true },
        }); // Redirect to ticket-detail with an error state
      }, 1500);
    }
  };
  

  const handlePaymentChange = (event) => {
    setSelectedPayment(event.target.value);
  };

  useEffect(() => {
    console.log(selectedPayment);
  }, [selectedPayment]);
  return (
    <div>
      <Header />
      {checkQr ? (
        <div className="flex justify-center">
          <div>
            <CountdownTimer />
            <img src={getImgSrc()?.url} />
            <div className="flex justify-center">
              <button onClick={handelTranferQr} className="btn btn-success">
                Đã chuyển khoản
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto p-4">
          <a onClick={() => navigate("/")} className="text-blue-600 mb-4 block">
            &lt; Quay lại
          </a>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Thông tin liên hệ</h2>
              <div className="mb-4">
                <label className="block text-gray-700">Tên người đi *</label>
                <input
                  type="text"
                  value={profile?.username}
                  className="w-full p-2 border rounded mt-1"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700">VN +84</label>
                  <input
                    type="text"
                    value="+84"
                    className="w-full p-2 border rounded mt-1"
                    readOnly
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700">Số điện thoại *</label>
                  <input
                    type="text"
                    value={profile?.numberPhone}
                    className="w-full p-2 border rounded mt-1"
                    readOnly
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Email để nhận thông tin đặt chỗ *
                </label>
                <input
                  type="email"
                  value={profile?.email}
                  className="w-full p-2 border rounded mt-1"
                  readOnly
                />
              </div>
              <div className="bg-green-100 p-4 rounded-lg text-green-700">
                <i className="fas fa-check-circle mr-2"></i>
                Số điện thoại và email được sử dụng để gửi thông tin đơn hàng và
                liên hệ khi cần thiết.
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {discounts.map((discount, index) => (
                    <div
                      onClick={() => {
                        setCheckSelectPromtion(discount?.codePromotion);
                      }}
                      key={index}
                      className={`border rounded-lg p-4 flex cursor-pointer hover:bg-gray-300 ${
                        checkSelectPromtion == discount?.codePromotion
                          ? "bg-gray-500"
                          : ""
                      }`}
                    >
                      <img
                        src={
                          "https://statics.oeg.vn/storage/pay-gate/visa-mastercard-ico.png"
                        }
                        alt="Discount image"
                        className="w-12 h-12 mr-4"
                      />
                      <div>
                        <div className="text-blue-600 font-bold">
                          {discount.title}
                        </div>
                        <div className="text-lg font-bold">
                          {discount.discount}
                        </div>
                        <div>{discount.condition}</div>
                        <div className="text-gray-500">{discount.expiry}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-blue-600 cursor-pointer">
                  <i className="fas fa-exclamation-circle"></i> Báo cáo sai /
                  thiếu thông tin
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-4">Tạm tính</h2>
              <div className="text-lg font-semibold text-gray-800 capitalize">
                giá : {Number(localStorage.getItem("priceTrip"))}đ
              </div>
              <div className="text-lg font-semibold text-gray-800 capitalize">
                số lượng : x {Number(localStorage.getItem("quantity"))}
              </div>
              <div className="text-lg font-semibold text-gray-800 capitalize">
                {Number(localStorage.getItem("priceTrip")) *
                  Number(localStorage.getItem("quantity"))}
                đ
              </div>
              <button
                onClick={handelBookTrip}
                className="w-full mt-5 bg-yellow-500 text-white py-2 rounded font-bold"
              >
                Thanh toán
              </button>
            </div>
          </div>
          <div className="col-span-2 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>
            <div className="mb-4">
              <input
                type="radio"
                id="qr-code"
                name="payment"
                value="qr-code"
                className="mr-2"
                checked={selectedPayment === "qr-code"}
                onChange={handlePaymentChange}
              />
              <label htmlFor="qr" className="font-bold">
                QR chuyển khoản/ Ví điện tử
              </label>
              <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded">
                An toàn & tiện lợi
              </span>
              <p className="text-gray-500 mt-2">
                Xác nhận thanh toán tức thì, nhanh
                chóng và ít sai sót.
              </p>
          
            </div>
          
            <div className="mb-4">
              <input
                type="radio"
                id="pay-on-bus"
                name="payment"
                value="pay-on-bus"
                className="mr-2"
                checked={selectedPayment === "pay-on-bus"}
                onChange={handlePaymentChange}
              />
              <label htmlFor="pay-on-bus" className="font-bold">
                Thanh toán khi lên xe
              </label>
              <p className="text-gray-500 mt-2">
                Bạn có thể thanh toán cho tài xế khi lên xe
              </p>
            </div>



            <p className="text-gray-500 text-center mt-2">
              Bằng việc nhấn nút Thanh toán, bạn đồng ý với{" "}
              <a href="#" className="text-blue-500">
                Chính sách bảo mật thanh toán
              </a>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 mt-4">
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-4">Thông tin chuyến đi</h2>
    <div className="mb-4">
      <div className="flex items-center mb-4">
        <i className="fas fa-clock text-blue-500 mr-2"></i>
        <p className="font-bold">{localStorage.getItem("startTime")}</p>
        <p className="ml-2">{localStorage.getItem("startPoint")}</p>
      </div>
      <div className="flex items-center">
        <i className="fas fa-clock text-blue-500 mr-2"></i>
        <p className="font-bold">{localStorage.getItem("endTime")}</p>
        <p className="ml-2">{localStorage.getItem("endPoint")}</p>
      </div>
    </div>
  </div>
</div>

        </div>
      )}
    </div>
  );
};

export default Bookingconfirmation;
