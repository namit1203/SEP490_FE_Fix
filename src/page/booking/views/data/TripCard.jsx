import { Tabs, Badge } from "antd";
import React from "react";
import { useTranslation } from 'react-i18next';
import { FiClock, FiMapPin, FiInfo, FiChevronDown, FiChevronUp, FiStar } from 'react-icons/fi';
import { FaBus, FaRegCheckCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getCountSeatDetailsById,
  getEndTripDetailsById,
  getStartTripDetailsById,
  getTripDetailsById,
} from "../../../../stores/BookingCar/action";
import { useAppDispatch, useAppSelector } from "../../../../stores/hooks";
import { ImageGallery } from "./ImageGallery";
import OptionTrip from "./OptionTrip";
import { PickupDropInfo } from "./PickupDropInfo";
import { PolicyDetails } from "./PolicyDetails";
import SelectTrip from "./SelectTrip";

export const TripCard = ({
  index,
  selectedTrip,
  setSelectedTrip,
  activeCardIndex,
  setActiveCardIndex,
  data,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [showOptionTrip, setShowOptionTrip] = React.useState(false);
  const DateTripStaion = useAppSelector((state) => state?.trips?.time);

  const handleOpenDetailsTrip = (id, index) => {
    if (activeCardIndex !== index) {
      dispatch(getTripDetailsById({ id }));
      setActiveCardIndex(index);
    }
  };

  const handleCloseDetailsTrip = () => {
    setActiveCardIndex(null);
  };

  const handleSelectTrip = (index) => {
    setSelectedTrip((prev) => {
      const isCurrentlySelected = prev[index];
      if (isCurrentlySelected) {
        setShowOptionTrip(false);
      }
      return {
        ...prev,
        [index]: !isCurrentlySelected,
      };
    });
  };

  const handleContinue = React.useCallback(async () => {
    try {
      setShowOptionTrip(true);
      await Promise.all([
        dispatch(getStartTripDetailsById({ id: data?.id })),
        dispatch(getEndTripDetailsById({ id: data?.id })),
        dispatch(
          getCountSeatDetailsById({ id: data?.id, dateTime: DateTripStaion })
        ),
      ]);
    } catch (error) {
      console.error("Error fetching trip details:", error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabItems = [
    {
      key: "2",
      label: (
        <div className="flex items-center gap-2">
          <FiMapPin className="w-4 h-4" />
          {t('booking.tripCard.tabs.pickupDrop')}
        </div>
      ),
      children: <PickupDropInfo />,
    },
    {
      key: "4",
      label: (
        <div className="flex items-center gap-2">
          <FiInfo className="w-4 h-4" />
          {t('booking.tripCard.tabs.policy')}
        </div>
      ),
      children: <PolicyDetails />,
    },
    {
      key: "5",
      label: (
        <div className="flex items-center gap-2">
          <FiStar className="w-4 h-4" />
          {t('booking.tripCard.tabs.images')}
        </div>
      ),
      children: <ImageGallery />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          {/* Left Section - Trip Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center"
              >
                <FaBus className="w-7 h-7 text-blue-600" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xl text-gray-900">{data?.fullName}</h3>
                  <Badge 
                    count="Premium" 
                    style={{ 
                      backgroundColor: '#4CAF50',
                      fontSize: '12px',
                      padding: '0 8px',
                    }} 
                  />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    <FiStar className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-600 ml-1">4.8</span>
                  </div>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-600">
                    {data?.listVehicle[0]?.numberSeat} {t('booking.tripCard.seats')}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 mt-1">
                  <FiClock className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {t('booking.tripDetails.startTime')}
                  </p>
                  <p className="text-sm text-gray-600">{data?.startTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 mt-1">
                  <FiMapPin className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {t('booking.tripDetails.startPoint')}
                  </p>
                  <p className="text-sm text-gray-600">{data?.pointStart}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 mt-1">
                  <FiMapPin className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {t('booking.tripDetails.endPoint')}
                  </p>
                  <p className="text-sm text-gray-600">{data?.pointEnd}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Price & Actions */}
          <div className="lg:w-80 flex flex-col">
            <motion.div 
              className="bg-gray-50 p-5 rounded-xl mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-1">{t('booking.tripDetails.price')}</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-3xl font-bold text-blue-600">
                    {data?.listVehicle[0]?.price?.toLocaleString()}đ
                  </p>
                  <Badge 
                    count="-10%" 
                    style={{ 
                      backgroundColor: '#ff4d4f',
                      fontSize: '12px',
                      padding: '0 8px',
                    }} 
                  />
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('booking.tripDetails.vehicleType')}</span>
                  <span className="font-medium">{data?.listVehicle[0]?.numberSeat} {t('booking.tripCard.seats')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('booking.tripCard.licensePlate')}</span>
                  <span className="font-medium">{data?.listVehicle[0]?.licensePlate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
              
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectTrip(index)}
                className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-200 ${
                  selectedTrip[index]
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {selectedTrip[index] ? (
                  <>
                    <FaRegCheckCircle className="w-5 h-5" />
                    {t('booking.tripCard.close')}
                  </>
                ) : (
                  t('booking.tripCard.selectTrip')
                )}
              </motion.button>
            </motion.div>

            <button
              onClick={
                activeCardIndex === index
                  ? handleCloseDetailsTrip
                  : () => handleOpenDetailsTrip(data?.id, index)
              }
              className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 py-2"
            >
              <FiInfo className="w-4 h-4" />
              {activeCardIndex === index 
                ? t('booking.tripCard.hideDetails') 
                : t('booking.tripCard.showDetails')}
              {activeCardIndex === index ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <AnimatePresence>
        {activeCardIndex === index && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100"
          >
            <Tabs 
              defaultActiveKey="1" 
              items={tabItems}
              className="px-6 py-4"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trip Selection & Options */}
      <AnimatePresence>
        {selectedTrip[index] && !showOptionTrip && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100 p-6"
          >
            <SelectTrip data={data} onContinue={handleContinue} />
          </motion.div>
        )}
        {selectedTrip[index] && showOptionTrip && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100 p-6"
          >
            <OptionTrip data={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
