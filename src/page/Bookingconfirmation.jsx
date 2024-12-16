import { message } from "antd";
import axios from "axios";
import { motion } from "framer-motion";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
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

  // State management
  const [promotion, setPromotion] = useState([]);
  const [ticketId, setTicketId] = useState(null);
  const [randomCode, setRandomCode] = useState(null);
  const [checkSelectPromtion, setCheckSelectPromtion] = useState(null);
  const [checkQr, setCheckQr] = useState(false);
  const [isBooking, setIsBooking] = useState(false); 
  const [selectedPayment, setSelectedPayment] = useState("");
  const [totalPrice] = useState(() => {
    const basePrice = Number(localStorage.getItem("priceTrip")) || 0;
    const qty = Number(localStorage.getItem("quantity")) || 0;
    return basePrice * qty;
  });
  const [discountedPrice, setDiscountedPrice] = useState(null);

  const quantity = useMemo(() => localStorage.getItem("quantity") || "0", []);

  // Format date helper
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, []);

  // Calculate discounted price
  const calculateDiscountedPrice = useCallback((promotionDiscount) => {
    const discount = Number(promotionDiscount) || 0;
    if (discount > 100) {
      return Math.max(totalPrice - discount, 0);
    } else {
      const discountAmount = (totalPrice * discount) / 100;
      return totalPrice - discountAmount;
    }
  }, [totalPrice]);

  // Fetch promotions
  const handelFetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Promotion/getPromotionById",
        {
          headers: {
            Authorization: `Bearer ${checkLoginToken()}`,
          },
        }
      );
      const currentDate = new Date();
      const validPromotions = data.filter(
        (item) => new Date(item.endDate) > currentDate
      );
      setPromotion(validPromotions);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      message.error(t("bookingConfirmation.errors.fetchPromotions"));
    }
  }, [t]);

  // Handle promotion selection
  const handlePromotionSelect = useCallback((promo) => {
    setCheckSelectPromtion(promo.codePromotion);
    const newDiscountedPrice = calculateDiscountedPrice(promo.discount);
    setDiscountedPrice(newDiscountedPrice);
  }, [calculateDiscountedPrice]);

  // Handle booking
  const handelBookTrip = async () => {
    if (isBooking) return; // Prevent multiple clicks
    setIsBooking(true); // Disable the button after the first click
  
    try {
      if (!selectedPayment) {
        message.error(t("bookingConfirmation.errors.selectPayment"));
        setIsBooking(false); // Re-enable button on error
        return;
      }
  
      if (selectedPayment === "pay-on-bus" && Number(quantity) > 1) {
        message.error(t("bookingConfirmation.errors.payOnBusLimit"));
        setIsBooking(false); // Re-enable button on error
        return;
      }
  
      const storedBookingTime = localStorage.getItem("bookingTime");
      if (!storedBookingTime) {
        message.error(t("bookingConfirmation.errors.noBookingTime"));
        setIsBooking(false); // Re-enable button on error
        return;
      }
  
      const bookingDate = storedBookingTime.split("T")[0];
      const randomCodeGenerated = Math.floor(100000 + Math.random() * 900000).toString();
      setRandomCode(randomCodeGenerated);
  
      const apiUrl = `https://boring-wiles.202-92-7-204.plesk.page/api/Ticket/bookTicket/${id}/${bookingDate}?numberTicket=${quantity}${checkSelectPromtion ? `&promotionCode=${checkSelectPromtion}` : ''}`;
  
      const response = await axios.post(
        apiUrl,
        {
          note: "string",
          typeOfPayment: selectedPayment === "pay-on-bus" ? 2 : 1
        },
        {
          headers: {
            Authorization: `Bearer ${checkLoginToken()}`,
          },
        }
      );
  
      setTicketId(response.data.ticketId);
  
      if (selectedPayment === "pay-on-bus") {
        message.success(t("bookingConfirmation.messages.payOnBusConfirmed"));
        navigate(`/ticket-detail/${response.data.ticketId}`);
      } else {
        setCheckQr(true);
      }
    } catch (error) {
      console.error("Booking error:", error);
      message.error(t("bookingConfirmation.errors.generic"));
    } finally {
      setIsBooking(false); // Re-enable button after completion
    }
  };

  // Handle QR transfer
  const handelTranferQr = async () => {
    try {
      const finalAmount = discountedPrice || totalPrice;
      const descriptionn = `${profile?.username}${randomCode}`;

      await axios.post(
        `https://boring-wiles.202-92-7-204.plesk.page/api/Payment?amout=${finalAmount}&description=${descriptionn}&codePayment=${randomCode}&ticketID=${ticketId}&typePayment=1&email=${profile?.email}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${checkLoginToken()}`,
          },
        }
      );

      message.success(t("bookingConfirmation.messages.paymentSuccess"));
      setTimeout(() => {
        navigate(`/ticket-detail/${ticketId}`);
      }, 1500);
    } catch (error) {
      console.error("Payment error:", error);
      message.error(t("bookingConfirmation.messages.paymentError"));
      setTimeout(() => {
        navigate(`/ticket-detail/${ticketId}`, { state: { error: true } });
      }, 1500);
    }
  };

  // Get QR image source
  const getImgSrc = () => {
    const totalAmount = discountedPrice || totalPrice;
    const accountNameTK = "Le Son Nam";
    const descriptionn = `${profile?.username}${randomCode || "000000"}`; // Fallback nếu randomCode null
    const bankId = "970415";
    const accountNo = "108881732352";
    const template = "print";
  
    return {
      url: `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${totalAmount}&addInfo=${descriptionn}&accountName=${accountNameTK}`,
    };
  };
  
  // Check authentication on mount
  useEffect(() => {
    const token = checkLoginToken();
    if (!token || !profile) {
      navigate('/login', { state: { from: `/bookingconfirmation/${id}` } });
      return;
    }

    handelFetchData();
  }, [handelFetchData, id, navigate, profile]);

  const renderPromotionCard = (promo) => (
    <motion.div
      key={promo.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-lg border ${
        checkSelectPromtion === promo.codePromotion
          ? 'border-green-500 bg-green-50'
          : 'border-gray-200 hover:border-green-200'
      } cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md`}
      onClick={() => handlePromotionSelect(promo)}
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
  );

  const renderTripInfo = () => {
    const startTime = localStorage.getItem("startTime") || "N/A";
    const startPoint = localStorage.getItem("startPoint") || "N/A";
    const endPoint = localStorage.getItem("endPoint") || "N/A";
  
    // Helper function to format currency
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('vi-VN').format(amount);
    };
  
    return (
      <div className="space-y-4">
        <div className="flex justify-between text-gray-600">
          <span>{t("bookingConfirmation.tripInfo.startTime")}:</span>
          <span>{startTime}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>{t("bookingConfirmation.tripInfo.startPoint")}:</span>
          <span>{startPoint}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>{t("bookingConfirmation.tripInfo.endPoint")}:</span>
          <span>{endPoint}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>{t("bookingConfirmation.tripInfo.price")}:</span>
          <span>{formatCurrency(localStorage.getItem("priceTrip"))}đ</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>{t("bookingConfirmation.tripInfo.quantity")}:</span>
          <span>x {quantity}</span>
        </div>
        {checkSelectPromtion && (
          <div className="flex justify-between text-green-600">
            <span>{t("bookingConfirmation.tripInfo.discount")}:</span>
            <span>
              {(() => {
                const selectedPromo = promotion.find(p => p.codePromotion === checkSelectPromtion);
                const discount = selectedPromo?.discount;
                if (discount > 100) {
                  return `-${formatCurrency(discount)}đ`;
                }
                return `-${discount}%`;
              })()}
            </span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-lg mt-2">
          <span>{t("bookingConfirmation.tripInfo.total")}:</span>
          <span>{formatCurrency(discountedPrice || totalPrice)}đ</span>
        </div>
      </div>
    );
  };
  
  

  // Add handlePaymentChange function
  const handlePaymentChange = useCallback((e) => {
    setSelectedPayment(e.target.value);
  }, []);

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
    <div className="border border-green-200 bg-green-50 rounded-lg p-4 flex items-center justify-between">
      <div>
        <h4 className="text-lg font-semibold text-green-800">
          {t("bookingConfirmation.payment.timeoutTitle")}
        </h4>

      </div>
      <div className="text-green-700 text-2xl font-bold">
        <CountdownTimer />
      </div>
    </div>

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
                  {promotion.map(renderPromotionCard)}
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

              {renderTripInfo()}
            </div>

            <button
  onClick={handelBookTrip}
  className={`w-full py-4 text-white rounded-lg transition-colors flex items-center justify-center ${
    isBooking ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
  }`}
  disabled={isBooking} // Disable the button while booking is in progress
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