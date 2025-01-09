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
    startPoint: "Hà Nội",
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
    const currentDateTime = new Date();
    const selectedDateTime = new Date(dataDetail.startTime);
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
    if (selectedDateTime < currentDateTime) {
      message.warning(t('convenient.messages.pastDateError'));
      return false;
    }
    if (!phoneNumber.trim()) {
      message.warning(t('convenient.messages.phoneRequired'));
      return false;
    }
    return true;
  };

  const handelBookTrip = async () => {
    if (!validateForm()) return;

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
    if (!validateForm()) return;

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

  return <div>{/* JSX omitted for brevity */}</div>;
};

export default Convenient;
