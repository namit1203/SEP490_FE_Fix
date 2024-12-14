import { useTranslation } from 'react-i18next';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const { t } = useTranslation();

  const socialLinks = [
    { icon: <FaFacebook />, href: '#', label: 'Facebook' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram' },
    { icon: <FaLinkedin />, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          {/* Logo Section */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <img
              src="https://i.imgur.com/qLCRwkv.png"
              alt="logo"
              className="h-12 md:h-14"
            />
          </motion.div>

          {/* Social Media Links */}
          <div className="flex space-x-6 mb-6">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-gray-600 hover:text-orange-500 text-2xl transition-colors duration-300"
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>

          {/* Copyright Section */}
          <div className="text-center space-y-2">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Car Booking. {t('footer.about')}
            </p>
            <p className="text-gray-500 text-xs">
              Email: support@carbooking.com | Tel: +84 123 456 789
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
