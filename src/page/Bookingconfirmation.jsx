import { message } from "antd";
import axios from "axios";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaBus,
  FaCoins,
  FaGift,
  FaMoneyBillWave,
  FaQrcode,
  FaRegClock
} from "react-icons/fa";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiCreditCard,
  FiPercent,
  FiTag,
  FiUser
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/app.context";
import { checkLoginToken } from "../utils";
import CountdownTimer from "./CountdownTimer";
import Header from "./Header";

const Bookingconfirmation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useContext(AppContext);
  const { id } = useParams();
  const [promotion, setPromotion] = useState([]);
  // const [promotionId, setPromotionId] = useState([]);
  const [ticketId, setTicketId] = useState(null);
  const [randomCode, setRandomCode] = useState(null);
  const quantity = localStorage.getItem("quantity") || "0";
  const [checkSelectPromtion, setCheckSelectPromtion] = useState(null);
  const [checkQr, setCheckQr] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

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

  // const handelFetchDataTipDetails = async () => {
  //   const { data } = await axios.get(
  //     "https://boring-wiles.202-92-7-204.plesk.page/api/TripDetails/tripId?TripId=" +
  //     localStorage.getItem("tripId"),
  //     {
  //       headers: {
  //         Authorization: "Bearer " + checkLoginToken(),
  //       },
  //     }
  //   );
  //   // console.log("promotionId", data);
  //   // console.log(promotionId)
  // };

  useEffect(() => {
    handelFetchData();
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

  // const discounts = promotion;
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
      message.error(error.response.data.message || "Thanh toán thất bại, vui lòng liên hệ bộ phận hỗ trợ!");
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {checkQr ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6"
          >
            <div className="space-y-6">
              <CountdownTimer />
              <img
                src={getImgSrc()?.url}
                className="w-full rounded-lg"
                alt={t("bookingConfirmation.payment.qrCode.title")}
              />
              <button
                onClick={handelTranferQr}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <FiCreditCard />
                <span>{t("bookingConfirmation.qrPayment.transferButton")}</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              {t("bookingConfirmation.backToHome")}
            </button>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FiUser className="mr-2" />
                {t("bookingConfirmation.contactInfo.title")}
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("bookingConfirmation.contactInfo.name")}
                  </label>
                  <input
                    type="text"
                    value={profile?.username}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("bookingConfirmation.contactInfo.phone")}
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <input
                        type="text"
                        value="+84"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={profile?.numberPhone}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("bookingConfirmation.contactInfo.email")}
                  </label>
                  <input
                    type="email"
                    value={profile?.email}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-700 text-sm flex items-center">
                    <FiAlertCircle className="mr-2" />
                    {t("bookingConfirmation.contactInfo.notice")}
                  </p>
                </div>
              </div>
            </div>

            {promotion.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <FaGift className="mr-2 text-green-600" />
                  {t("bookingConfirmation.promotions.title")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {promotion.map((promo) => (
                    <motion.div
                      key={promo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className={`relative overflow-hidden rounded-lg border ${checkSelectPromtion === promo.codePromotion
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-200'
                        } cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md`}
                      onClick={() => setCheckSelectPromtion(promo.codePromotion)}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {promo.description}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-green-100 text-green-800 font-medium">
                                <FiTag className="mr-1" />
                                {promo.codePromotion}
                              </span>
                              <span className="inline-flex items-center text-lg font-bold text-green-600">
                                <FiPercent className="mr-1" />
                                {promo.discount}
                              </span>
                            </div>
                          </div>

                          {checkSelectPromtion === promo.codePromotion && (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <FiCheck className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FiCalendar className="mr-2" />
                            <span>
                              {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FaCoins className="mr-2 text-yellow-500" />
                            <span>
                              {promo.exchangePoint} {t("bookingConfirmation.promotions.points")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {promo.imagePromotion && promo.imagePromotion !== "string" && (
                        <div className="h-24 bg-gray-100 overflow-hidden">
                          <img
                            src={promo.imagePromotion}
                            alt={promo.description}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {new Date(promo.endDate) < new Date(new Date().setDate(new Date().getDate() + 7)) && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2.5 py-1 rounded-full flex items-center">
                          <FaRegClock className="mr-1 text-xs" />
                          {t("bookingConfirmation.promotions.expiresText")}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {promotion.length === 0 && (
                  <div className="text-center py-8 text-gray-500 flex items-center justify-center">
                    <FiTag className="mr-2" />
                    {t("bookingConfirmation.promotions.noPromotions")}
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FiCreditCard className="mr-2" />
                {t("bookingConfirmation.payment.title")}
              </h2>

              <div className="space-y-4">
                <label className="block">
                  <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPayment === "qr-code" ? "border-green-500 bg-green-50" : "border-gray-200"
                    }`}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="qr-code"
                        checked={selectedPayment === "qr-code"}
                        onChange={handlePaymentChange}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-semibold flex items-center">
                          <FaQrcode className="mr-2" />
                          {t("bookingConfirmation.payment.qrCode.title")}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {t("bookingConfirmation.payment.qrCode.description")}
                        </p>
                      </div>
                    </div>
                  </div>
                </label>

                <label className="block">
                  <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPayment === "pay-on-bus" ? "border-green-500 bg-green-50" : "border-gray-200"
                    }`}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="pay-on-bus"
                        checked={selectedPayment === "pay-on-bus"}
                        onChange={handlePaymentChange}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-semibold flex items-center">
                          <FaMoneyBillWave className="mr-2" />
                          {t("bookingConfirmation.payment.cashOnBus.title")}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {t("bookingConfirmation.payment.cashOnBus.description")}
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaBus className="mr-2" />
                {t("bookingConfirmation.tripInfo.title")}
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">09:30:00</p>
                    <p className="text-gray-600">Xuất bến Mỹ Đình</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">12:10:00</p>
                    <p className="text-gray-600">Bến xe Nhã Nam</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>{t("bookingConfirmation.tripInfo.price")}:</span>
                    <span>{localStorage.getItem("priceTrip")}đ</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{t("bookingConfirmation.tripInfo.quantity")}:</span>
                    <span>x {quantity}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg mt-2">
                    <span>{t("bookingConfirmation.tripInfo.total")}:</span>
                    <span>{Number(localStorage.getItem("priceTrip")) * Number(quantity)}đ</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handelBookTrip}
              className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <FiCreditCard className="mr-2" />
              {t("booking.selectTrip.summary.bookButton")}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Bookingconfirmation;
