import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FiChevronLeft, FiChevronRight, FiFlag } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export const ImageGallery = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Sample images array - replace with actual data from props
  const images = [
    "https://xelimou.vn/wp-content/uploads/2024/07/xe-nha-nam-gia-lam-2.jpg",
    "https://xelimou.vn/wp-content/uploads/2024/07/xe-nha-nam-gia-lam-2.jpg",
    "https://xelimou.vn/wp-content/uploads/2024/07/xe-nha-nam-gia-lam-2.jpg",
    "https://xelimou.vn/wp-content/uploads/2024/07/xe-nha-nam-gia-lam-2.jpg",
    "https://xelimou.vn/wp-content/uploads/2024/07/xe-nha-nam-gia-lam-2.jpg",
    "https://xelimou.vn/wp-content/uploads/2024/07/xe-nha-nam-gia-lam-2.jpg"
  ];

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsLoading(true);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsLoading(true);
  }, [images.length]);

  const handleThumbnailClick = (index) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
      setIsLoading(true);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = (e) => {
    e.target.src = 'fallback-image-url.jpg'; // Add a fallback image URL
    setIsLoading(false);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Main Image Container */}
      <div 
        className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={t('booking.gallery.altText.mainImage')}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </AnimatePresence>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/10 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Watermark */}
        <div className="absolute bottom-4 left-4 bg-black/30 px-3 py-1 rounded-lg backdrop-blur-sm">
          <span className="text-white text-lg font-semibold">
            {t('booking.gallery.watermark')}
          </span>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevious}
            className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-colors"
            aria-label={t('booking.gallery.prev')}
          >
            <FiChevronLeft className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-colors"
            aria-label={t('booking.gallery.next')}
          >
            <FiChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {images.map((image, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleThumbnailClick(index)}
            className={`flex-shrink-0 relative rounded-lg overflow-hidden ${
              currentIndex === index
                ? 'ring-2 ring-blue-500'
                : 'ring-1 ring-gray-200 hover:ring-blue-200'
            }`}
          >
            <img
              src={image}
              alt={t('booking.gallery.altText.thumbnail', { index: index + 1 })}
              className={`w-20 h-20 object-cover transition-opacity duration-200 ${
                currentIndex === index ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
              onError={handleImageError}
            />
          </motion.button>
        ))}
      </div>

      {/* Image Counter and Report Issue */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          {t('booking.gallery.imageCount', {
            current: currentIndex + 1,
            total: images.length
          })}
        </span>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <FiFlag className="w-4 h-4" />
          <span>{t('booking.gallery.reportIssue')}</span>
        </motion.button>
      </div>
    </div>
  );
};
