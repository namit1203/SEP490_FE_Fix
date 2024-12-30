import { message } from "antd";
import axios from "axios";
import { motion } from 'framer-motion';
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../stores/hooks";
import { checkLoginToken, getTripDetailId } from "../../../../utils";

export default function OptionTrip({ data }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedDropoff, setSelectedDropoff] = useState(null);
  const [listTrip, setListTrip] = useState({});

  console.log(data);
  


  const countSeat = useAppSelector((state) => state.trips?.countseat);
  const quantity = localStorage.getItem("quantity");


  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await axios.get(
          `https://boring-wiles.202-92-7-204.plesk.page/api/TripDetails/tripId?TripId=${data?.id}`,
          {
            headers: {
              Authorization: `Bearer ${checkLoginToken()}`,
            },
          }
        );
        // Transform the data
        const result = response.data;

        // Extract `start` and `end` lists
        const startList = result.map((item) => ({
          pointStartDetails: item.pointStartDetails,
          timeStartDetils: item.timeStartDetils,
        }));

        // Assuming all trips have the same end point and time (as seen in the response)
        const endList = [
          {
            pointEndDetails: result[0]?.pointEndDetails || "",
            timeEndDetails: result[0]?.timeEndDetails || "",
          },
        ];
        // Update state
        setListTrip({
          data: result,
          start: startList,
          end: endList,
        });
      } catch (error) {
        console.error("API call error:", error.message);
        message.error("Failed to load trip details");
      }
    };

    if (data?.id) {
      fetchTripDetails();
    }
  }, [data?.id]);

  const handleTransaction = () => {
    if (!selectedPickup || !selectedDropoff) {
      message.error(t('booking.optionTrip.errors.selectBoth'));
      return;
    }

    if (countSeat === 0 || quantity > countSeat) {
      message.error("No seats available for this trip!");
      return;
    }

    localStorage.setItem("priceTrip", data?.listVehicle[0]?.price);
    const tripDetailId = getTripDetailId(
      listTrip?.data,
      localStorage.getItem("startPoint"),
      localStorage.getItem("endPoint")
    );
    localStorage.setItem("tripId", data?.id);
    navigate(`/bookingconfirmation/${tripDetailId}`);
  };

  const handlePickupSelect = (item) => {
    setSelectedPickup(item);
    localStorage.setItem("startTime", item?.timeStartDetils);
    localStorage.setItem("startPoint", item?.pointStartDetails);
  };

  const handleDropoffSelect = (item) => {
    setSelectedDropoff(item);
    localStorage.setItem("endTime", item?.timeEndDetails);
    localStorage.setItem("endPoint", item?.pointEndDetails);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Alert Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-green-50 border border-green-200 rounded-lg p-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h3 className="font-medium text-green-800">
              {t('booking.optionTrip.alert.title')}
            </h3>
            <p className="text-green-700 text-sm mt-1">
              {t('booking.optionTrip.alert.message')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Points Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pickup Points */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-bold text-gray-800">
            {t('booking.optionTrip.pickupPoints.title')}
          </h2>
          <div className="space-y-4">
            {listTrip?.start?.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 border rounded-lg transition-all duration-200 ${selectedPickup === item
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                  }`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="pickup"
                    className="mt-1"
                    checked={selectedPickup === item}
                    onChange={() => handlePickupSelect(item)}
                  />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium">{item?.timeStartDetils}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-sm text-gray-800">{item?.pointStartDetails}</span>
                    </div>
                    <p className="text-sm text-green-600 mt-2">

                    </p>
                  </div>
                </label>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Dropoff Points */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-bold text-gray-800">
            {t('booking.optionTrip.dropoffPoints.title')}
          </h2>
          <div className="space-y-4">
            {listTrip?.end?.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 border rounded-lg transition-all duration-200 ${selectedDropoff === item
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                  }`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="dropoff"
                    className="mt-1"
                    checked={selectedDropoff === item}
                    onChange={() => handleDropoffSelect(item)}
                  />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium">{item?.timeEndDetails}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-sm text-gray-800">{item?.pointEndDetails}</span>
                    </div>
                    <p className="text-sm text-green-600 mt-2">

                    </p>
                  </div>
                </label>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Summary Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100"
      >
        <div className="flex items-center gap-4">
          <div className="text-gray-600">
            {t('booking.optionTrip.selectedSeat')}:{' '}
            <span className="text-blue-600 font-medium">A3</span>
          </div>
          <div className="text-gray-600 text-sm">
            {t('booking.optionTrip.seatsAvailable', { count: countSeat || 0 })}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleTransaction}
          className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          {t('booking.optionTrip.payment')}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
