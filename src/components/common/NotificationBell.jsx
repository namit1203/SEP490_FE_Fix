import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiBell } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBell = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: t('notifications.booking.title'),
      message: t('notifications.booking.message'),
      time: '5m',
      isRead: false,
    },
    {
      id: 2,
      title: t('notifications.promotion.title'),
      message: t('notifications.promotion.message'),
      time: '1h',
      isRead: true,
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative notification-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <FiBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('notifications.title')}
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {t('notifications.markAllRead')}
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg transition-colors duration-200 cursor-pointer
                      ${notification.isRead ? 'bg-gray-50' : 'bg-blue-50'}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                  </motion.div>
                ))}

                {notifications.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    {t('notifications.empty')}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell; 