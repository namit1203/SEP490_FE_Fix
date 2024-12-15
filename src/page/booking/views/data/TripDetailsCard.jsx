import { useTranslation } from 'react-i18next';
import { FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const TripDetailsCard = ({ item }) => {
  const { t } = useTranslation();

  const fieldsToDisplay = {
    pointStartDetails: {
      label: t('booking.pickupDrop.details.pickupPoint'),
      icon: <FiMapPin className="w-5 h-5 text-green-500" />
    },
    pointEndDetails: {
      label: t('booking.pickupDrop.details.dropoffPoint'),
      icon: <FiMapPin className="w-5 h-5 text-red-500" />
    },
    timeStartDetils: {
      label: t('booking.pickupDrop.details.startTime'),
      icon: <FiClock className="w-5 h-5 text-blue-500" />
    },
    timeEndDetails: {
      label: t('booking.pickupDrop.details.endTime'),
      icon: <FiClock className="w-5 h-5 text-purple-500" />
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100"
    >
      <div className="relative">
        {/* Route Line */}
        <div className="absolute left-[22px] top-12 bottom-12 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-red-500 opacity-20"></div>

        <div className="space-y-6">
          {Object.entries(item)
            .filter(([key]) => fieldsToDisplay[key])
            .map(([key, value], index, array) => (
              <div key={key} className="flex items-start gap-4">
                <div className="relative">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                    key.includes('time') ? 'bg-blue-50' : 'bg-gray-50'
                  }`}>
                    {fieldsToDisplay[key].icon}
                  </div>
                  {index < array.length - 1 && (
                    <div className="absolute left-5 top-11 h-6">
                      <FiArrowRight className="w-4 h-4 text-gray-300 rotate-90" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {fieldsToDisplay[key].label}
                  </p>
                  <p className={`text-sm ${
                    key.includes('time') 
                      ? 'text-blue-600 font-medium' 
                      : 'text-gray-700'
                  }`}>
                    {value}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};
