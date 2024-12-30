import { Input } from "antd";
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import IconsSeat from "../../../../components/icons/seat";
import { useContext } from 'react';
import { AppContext } from '../../../../context/app.context';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

export default function SelectTrip({ data, onContinue }) {
  const { t } = useTranslation();
  const { profile } = useContext(AppContext);
  const navigate = useNavigate();

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      localStorage.setItem("quantity", value);
    }
  };

  const handleContinue = () => {
    // Set booking time in localStorage
    // const currentDateTime = new Date().toISOString();


    if (!profile) {
      message.warning(t('auth.requireLogin'));
      setTimeout(() => {
        navigate('/login', { state: { from: window.location.pathname } });
      }, 1000);
      return;
    }
    onContinue();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg p-6 shadow-sm"
    >
      {/* Legend Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800">
          {t('booking.selectTrip.legend')}
        </h2>
        
        {/* Seat Selection */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg p-2 shadow-sm border border-gray-100"
            >
              <IconsSeat />
            </motion.div>
          </div>

          <div className="flex-1 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Input
                type="number"
                min={0}
                placeholder={t('booking.selectTrip.seatQuantity.placeholder')}
                onChange={handleQuantityChange}
                className="w-full sm:w-48 focus:border-blue-500"
              />
              <label className="text-sm text-gray-600 whitespace-nowrap">
                {t('booking.selectTrip.seatQuantity.label')}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Seat Information */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600">
              {t('booking.selectTrip.summary.seats')}:
            </span>
            <span className="text-blue-600 font-medium">A3</span>
          </div>

          {/* Price and Action */}
          <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">
                {t('booking.selectTrip.summary.total')}:
              </span>
              <span className="text-blue-600 font-bold">
                {data?.listVehicle[0]?.price?.toLocaleString()}
                {t('booking.selectTrip.summary.currency')}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              {t('booking.selectTrip.summary.bookButton')}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
