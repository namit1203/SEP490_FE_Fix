import { useTranslation } from 'react-i18next';
import { useAppSelector } from "../../../stores/hooks";
import DataTrip from "./data/DataTrip";
import BookingFilter from "./filter/BookingFilter";
import BookingSort from "./sort/BookingSort";

export default function DataViews() {
  const { t } = useTranslation();
  const DataTripStaion = useAppSelector((state) => state.trips?.data);

  const sortingOptions = [
    { id: 1, label: t('booking.sort.default') },
    { id: 2, label: t('booking.sort.earliestDeparture') },
    { id: 3, label: t('booking.sort.latestDeparture') },
    { id: 4, label: t('booking.sort.highestRating') },
    { id: 5, label: t('booking.sort.priceAscending') },
    { id: 6, label: t('booking.sort.priceDescending') },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Filter and Sort Section */}
      <div className="lg:col-span-1 space-y-4">
        {/* Sort */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <BookingSort options={sortingOptions} />
        </div>
        {/* Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <BookingFilter />
        </div>
      </div>

      {/* Results Section */}
      <div className="lg:col-span-3">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {t('booking.results.title')}:{' '}
            <span className="text-blue-600">
              {DataTripStaion?.length || 0} {t('booking.results.trips')}
            </span>
          </h2>
        </div>
        <DataTrip />
      </div>
    </div>
  );
}
