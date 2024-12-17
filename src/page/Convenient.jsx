import { useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import Header from "./Header";
import Footer from "./Footer";
import { message } from "antd";
import axios from "axios";
import { checkLoginToken } from "../utils";
import { AppContext } from "../context/app.context";
import { useNavigate } from "react-router-dom";

const Convenient = () => {
  const { profile } = useContext(AppContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [dataDetail, setDataDetail] = useState({
    startPoint:"Hà Nội",
    endPoint: "Bắc Giang",
    startTime: "",
  });
  const [price, setPrice] = useState(null);
  const [finalPrice, setFinalPrice] = useState(null);
  const [selectedService, setSelectedService] = useState("ConvenientTrip");
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(profile?.numberPhone || "");
  const [loading, setLoading] = useState(false);
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
  
        // Filter promotions where endDate is greater than or equal to the current date
        const currentDate = new Date();
        const validPromotions = data.filter((promo) => {
          const promoEndDate = new Date(promo.endDate);
          return promoEndDate >= currentDate;
        });
  
        const uniquePromotions = Array.from(
          new Map(validPromotions.map((promo) => [promo.codePromotion, promo])).values()
        );
        setPromotions(uniquePromotions);
      } catch (error) {
        console.error("Error:", error);
        message.error(t('convenient.messages.loadingError'));
      }
    };
  
    if (checkLoginToken() && profile) {
      fetchPromotions();
    }
  }, [t, profile]);
  
  const validateForm = () => {
    if (!dataDetail.startPoint.trim()) {
      message.warning(t('convenient.messages.startPointRequired'));
      return false;
    }
    if (!dataDetail.endPoint.trim()) {
      message.warning(t('convenient.messages.endPointRequired'));
      return false;
    }
    if (!dataDetail.startTime) {
      message.warning(t('convenient.messages.timeRequired'));
      return false;
    }
    if (!phoneNumber.trim()) {
      message.warning(t('convenient.messages.phoneRequired'));
      return false;
    }
    return true; // Dữ liệu hợp lệ
  };
  
  const handelBookTrip = async () => {
    if (!validateForm()) return; // Kiểm tra dữ liệu đầu vào
  
    const token = checkLoginToken();
    if (!token || !profile) {
      message.warning(t('auth.requireLogin'));
      navigate('/login', { state: { from: '/convenient' } });
      return;
    }
  
    setLoading(true);
    const tripType = selectedService === "ConvenientTrip" ? 2 : 3;
    try {
      const { data } = await axios.get(
        `https://boring-wiles.202-92-7-204.plesk.page/api/Trip/searchTripForConvenient/${dataDetail.startPoint}/${dataDetail.endPoint}/${tripType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (data?.price) {
        setPrice(data.price);
        setFinalPrice(null);
        message.success(t('convenient.messages.priceUpdated'));
      }
    } catch (error) {
      console.error("Error:", error);
      message.error(t('convenient.messages.priceError'));
    } finally {
      setLoading(false);
    }
  };
  

  const handleApplyPromotion = () => {
    if (!price) {
      message.warning(t('convenient.messages.checkPrice'));
      return;
    }

    if (selectedPromotion) {
      const selectedPromo = promotions.find(
        (promo) => promo.codePromotion === selectedPromotion
      );

      if (!selectedPromo) {
        message.warning(t('convenient.messages.invalidPromo'));
        return;
      }

      const discount = selectedPromo.discount || 0;
      const discountedPrice = price - (price * discount) / 100;
      setFinalPrice(discountedPrice);

      message.success(t('convenient.messages.promoApplied', { description: selectedPromo.description }));
    } else {
      setFinalPrice(price);
      message.info(t('convenient.messages.noPromo'));
    }
  };

  const handelResult = async () => {
    if (!validateForm()) return; // Kiểm tra dữ liệu đầu vào
  
    const token = checkLoginToken();
    if (!token || !profile) {
      message.warning(t('auth.requireLogin'));
      navigate('/login', { state: { from: '/convenient' } });
      return;
    }
  
    if (!finalPrice) {
      message.warning(t('convenient.messages.applyFirst'));
      return;
    }
  
    setLoading(true);
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
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success(t('convenient.messages.bookingSuccess'));
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (error) {
      console.error(error);
      message.error(t('convenient.messages.bookingError'));
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 mt-12">
          {t('convenient.title')}
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('convenient.service.label')}
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
            
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="service"
                      value="PrivateTrip"
                      checked={selectedService === "PrivateTrip"}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>{t('convenient.service.private')}</span>
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('convenient.form.startPoint')}
                  </label>
                  <input
                    type="text"
                    value={dataDetail.startPoint}
                    onChange={(e) =>
                      setDataDetail({ ...dataDetail, startPoint: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('convenient.form.endPoint')}
                  </label>
                  <input
                    type="text"
                    value={dataDetail.endPoint}
                    onChange={(e) =>
                      setDataDetail({ ...dataDetail, endPoint: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('convenient.form.time')}
                  </label>
                  <input
                    type="datetime-local"
                    value={dataDetail.startTime}
                    onChange={(e) =>
                      setDataDetail({ ...dataDetail, startTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('convenient.form.phone')}
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handelBookTrip}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? t('profile.rewards.loading') : t('convenient.form.searchButton')}
              </button>
            </div>
          </div>

          {/* Price and Promotion Section */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              {/* Price Display */}
              {price !== null && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    {t('convenient.price.original')}:{' '}
                    <span className={finalPrice ? 'line-through text-gray-400' : 'font-semibold'}>
                      {price.toLocaleString()}{t('convenient.price.currency')}
                    </span>
                  </p>
                  {finalPrice && (
                    <p className="text-green-600 font-semibold mt-2">
                      {t('convenient.price.discounted')}:{' '}
                      {finalPrice.toLocaleString()}{t('convenient.price.currency')}
                    </p>
                  )}
                </div>
              )}

              {/* Promotion Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('convenient.promotion.label')}
                </label>
                <select
                  value={selectedPromotion}
                  onChange={(e) => setSelectedPromotion(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-3"
                >
                  <option value="">{t('convenient.promotion.placeholder')}</option>
                  {promotions.map((promo) => (
                    <option key={promo.codePromotion} value={promo.codePromotion}>
                      {promo.codePromotion} - {t('convenient.promotion.discount', { percent: promo.discount })}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleApplyPromotion}
                  disabled={!price || loading}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {t('convenient.promotion.apply')}
                </button>
              </div>

              {/* Book Button */}
              {finalPrice && (
                <button
                  onClick={handelResult}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium disabled:opacity-50"
                >
                  {loading ? t('profile.rewards.loading') : t('convenient.form.bookButton')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Convenient;
