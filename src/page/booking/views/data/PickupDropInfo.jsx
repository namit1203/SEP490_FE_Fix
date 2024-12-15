import { Spin } from "antd";
import { useTranslation } from 'react-i18next';
import { FiAlertCircle, FiFlag, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAppSelector } from "../../../../stores/hooks";
import { TripDetailsCard } from "./TripDetailsCard";

export const PickupDropInfo = () => {
  const { t } = useTranslation();
  const dataDetails = useAppSelector((state) => state.trips?.tripDetails);
  const isLoadingDetails = useAppSelector(
    (state) => state.trips?.loadingDetails
  );

  if (isLoadingDetails) {
    return (
      <div className="flex flex-col justify-center items-center p-12">
        <Spin size="large" />
        <p className="mt-4 text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Note Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 mb-6 border border-blue-200"
      >
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FiAlertCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <h3 className="text-blue-700 font-semibold mb-2 flex items-center gap-2">
              {t('booking.pickupDrop.note')}
              <FiClock className="w-4 h-4" />
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('booking.pickupDrop.disclaimer')}
              <br />
              {t('booking.pickupDrop.scheduleChange')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Trip Details Cards */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {dataDetails?.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <TripDetailsCard item={item} />
          </motion.div>
        ))}
      </motion.div>

      {/* Report Issue Link */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex items-center justify-center"
      >
        <button className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
          <FiFlag className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
          <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors duration-200">
            {t('booking.pickupDrop.reportIssue')}
          </span>
        </button>
      </motion.div>
    </div>
  );
};
