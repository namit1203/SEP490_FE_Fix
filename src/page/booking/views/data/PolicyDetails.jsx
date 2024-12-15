import { useTranslation } from 'react-i18next';
import { FiAlertCircle, FiFlag } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const PolicyDetails = () => {
  const { t } = useTranslation();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const listItem = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Cancellation Policy */}
      <motion.section {...fadeInUp} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">
          {t('booking.policy.cancellation.title')}
        </h2>
        
        <div className="relative">
          <div className="flex items-center mb-4">
            <div className="flex-1 text-center bg-yellow-500 text-white py-2 rounded-l-lg">
              {t('booking.policy.cancellation.today')}
            </div>
            <div className="flex-1 text-center bg-gray-100 py-2">
              21:00
            </div>
            <div className="flex-1 text-center bg-red-500 text-white py-2 rounded-r-lg">
              {t('booking.policy.cancellation.departure')}
            </div>
          </div>
          
          <div className="flex justify-between text-sm mb-4 px-2">
            <span className="text-green-600 font-medium">
              {t('booking.policy.cancellation.noFee')}
            </span>
            <span className="text-red-600 font-medium">
              {t('booking.policy.cancellation.fullFee')}
            </span>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex gap-3">
              <FiAlertCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                {t('booking.policy.cancellation.noteText')}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Bus Policy */}
      <motion.section {...fadeInUp} className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800">
          {t('booking.policy.busPolicy.title')}
        </h2>

        {/* Boarding Requirements */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            {t('booking.policy.busPolicy.boarding.title')}
          </h3>
          <ul className="space-y-2">
            {t('booking.policy.busPolicy.boarding.items', { returnObjects: true }).map((item, index) => (
              <motion.li
                key={index}
                variants={listItem}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 text-gray-600"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                <span className="text-sm">{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Luggage */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            {t('booking.policy.busPolicy.luggage.title')}
          </h3>
          <ul className="space-y-2">
            {t('booking.policy.busPolicy.luggage.items', { returnObjects: true }).map((item, index) => (
              <motion.li
                key={index}
                variants={listItem}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 text-gray-600"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                <span className="text-sm">{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Special Passengers */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            {t('booking.policy.busPolicy.specialPassengers.title')}
          </h3>
          <ul className="space-y-2">
            {t('booking.policy.busPolicy.specialPassengers.items', { returnObjects: true }).map((item, index) => (
              <motion.li
                key={index}
                variants={listItem}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 text-gray-600"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                <span className="text-sm">{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Pets */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            {t('booking.policy.busPolicy.pets.title')}
          </h3>
          <ul className="space-y-2">
            {t('booking.policy.busPolicy.pets.items', { returnObjects: true }).map((item, index) => (
              <motion.li
                key={index}
                variants={listItem}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 text-gray-600"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                <span className="text-sm">{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Invoice */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            {t('booking.policy.busPolicy.invoice.title')}
          </h3>
          <ul className="space-y-2">
            {t('booking.policy.busPolicy.invoice.items', { returnObjects: true }).map((item, index) => (
              <motion.li
                key={index}
                variants={listItem}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 text-gray-600"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                <span className="text-sm">{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* Report Issue */}
      <motion.div
        {...fadeInUp}
        className="flex justify-end pt-4"
      >
        <button
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          <FiFlag className="w-4 h-4" />
          {t('booking.policy.reportIssue')}
        </button>
      </motion.div>
    </div>
  );
};
