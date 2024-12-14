import { useState, useContext } from "react";
import { useTranslation } from 'react-i18next';
import { FiMapPin, FiCalendar, FiClock, FiTruck } from 'react-icons/fi';
import Header from "./Header";
import Footer from "./Footer";
import { message } from "antd";
import axios from "axios";
import { checkLoginToken } from "../utils";
import { AppContext } from "../context/app.context";
import { useNavigate } from "react-router-dom";

const RenterCar = () => {
  const { profile } = useContext(AppContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const [dataDetail, setDataDetail] = useState({
    startLocation: "Ha Noi",
    endLocation: "Bac Giang",
    startTime: "",
    endTime: "",
    seats: "7",
  });

  const features = [
    {
      title: t('carRental.info.features.0.title'),
      description: t('carRental.info.features.0.description'),
      icon: <FiTruck />
    },
    {
      title: t('carRental.info.features.1.title'),
      description: t('carRental.info.features.1.description'),
      icon: <FiMapPin />
    },
    {
      title: t('carRental.info.features.2.title'),
      description: t('carRental.info.features.2.description'),
      icon: <FiCalendar />
    },
    {
      title: t('carRental.info.features.3.title'),
      description: t('carRental.info.features.3.description'),
      icon: <FiClock />
    }
  ];

  const handelSubmit = async () => {
    const token = checkLoginToken();
    if (!token || !profile) {
      message.warning(t('auth.requireLogin'));
      navigate('/login', { state: { from: '/renter' } });
      return;
    }

    if (!dataDetail.startTime || !dataDetail.endTime) {
      message.warning(t('carRental.messages.timeRequired'));
      return;
    }

    setLoading(true);
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success(t('carRental.messages.success'));
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      message.error(t('carRental.messages.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 mt-10">
            {t('carRental.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('carRental.subtitle')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Booking Form */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              {/* Location Inputs */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMapPin className="inline-block mr-2" />
                    {t('carRental.form.startLocation.label')}
                  </label>
                  <input
                    type="text"
                    value={dataDetail.startLocation}
                    onChange={(e) =>
                      setDataDetail({ ...dataDetail, startLocation: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder={t('carRental.form.startLocation.placeholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMapPin className="inline-block mr-2" />
                    {t('carRental.form.endLocation.label')}
                  </label>
                  <input
                    type="text"
                    value={dataDetail.endLocation}
                    onChange={(e) =>
                      setDataDetail({ ...dataDetail, endLocation: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder={t('carRental.form.endLocation.placeholder')}
                  />
                </div>
              </div>

              {/* Time Inputs */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiCalendar className="inline-block mr-2" />
                    {t('carRental.form.startTime.label')}
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
                    <FiClock className="inline-block mr-2" />
                    {t('carRental.form.endTime.label')}
                  </label>
                  <input
                    type="datetime-local"
                    value={dataDetail.endTime}
                    onChange={(e) =>
                      setDataDetail({ ...dataDetail, endTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Car Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiTruck className="inline-block mr-2" />
                  {t('carRental.form.carType.label')}
                </label>
                <select
                  value={dataDetail.seats}
                  onChange={(e) =>
                    setDataDetail({ ...dataDetail, seats: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {[7, 16, 29, 45].map((seat) => (
                    <option key={seat} value={seat}>
                      {t(`carRental.form.carType.options.${seat}`)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                onClick={handelSubmit}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 font-medium"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('profile.rewards.loading')}
                  </span>
                ) : (
                  t('carRental.form.bookButton')
                )}
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {t('carRental.info.title')}
              </h3>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        {feature.title}
                      </h4>
                      <p className="mt-2 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RenterCar;
