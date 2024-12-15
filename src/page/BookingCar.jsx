import { useTranslation } from 'react-i18next';
import Footer from "./Footer";
import Header from "./Header";
import BookingCarViews from "./booking";

export default function BookingCar() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Title Section */}
          <div className="text-center sm:text-left mt-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              {t('booking.title')}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              {t('booking.search.title')}
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <BookingCarViews />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
