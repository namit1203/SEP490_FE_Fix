import { useTranslation } from 'react-i18next';
import TimeFilter from "./timeFilter/TimeFilter";
import GarageFilter from "./garageFilter/GarageFilter";
import PriceFilter from "./priceFilter/PriceFilter";

export default function BookingFilter() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('booking.filter.title')}
        </h3>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 underline">
          {t('booking.filter.clearAll')}
        </button>
      </div>

      <div className="space-y-6 divide-y divide-gray-200">
        <TimeFilter />
        <GarageFilter />
        <PriceFilter />
      </div>
    </div>
  );
}
