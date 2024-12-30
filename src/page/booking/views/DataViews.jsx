import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useAppSelector } from "../../../stores/hooks";
import DataTrip from "./data/DataTrip";
import BookingFilter from "./filter/BookingFilter";
import BookingSort from "./sort/BookingSort";

export default function DataViews() {
  const { t } = useTranslation();
  const DataTripStaion = useAppSelector((state) => state.trips?.data);
    
  // Add filter and sort states
  const [filters, setFilters] = useState({
    timeRange: [],
    selectedGarages: [],
    priceRange: [0, 1000000],
  });
  const [sortOption, setSortOption] = useState(1); // Default sort option

  // Filter and sort the data
  const processedData = useMemo(() => {
    // First filter the data
    let result = DataTripStaion.filter(trip => {
      // Time filter
      if (filters.timeRange.length === 2) {
        const tripTime = parseInt(trip.startTime.split(':')[0]);
        if (tripTime < filters.timeRange[0] || tripTime > filters.timeRange[1]) {
          return false;
        }
      }

      // Garage filter
      if (filters.selectedGarages.length > 0 && !filters.selectedGarages.includes(trip.fullName)) {
        return false;
      }

      // Price filter
      const price = trip.listVehicle[0]?.price || 0;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      return true;
    });

    // Then sort the filtered data
    switch (sortOption) {
      case 2: // Earliest Departure
        return [...result].sort((a, b) => {
          const timeA = new Date(`2000/01/01 ${a.startTime}`);
          const timeB = new Date(`2000/01/01 ${b.startTime}`);
          return timeA - timeB;
        });
      case 3: // Latest Departure
        return [...result].sort((a, b) => {
          const timeA = new Date(`2000/01/01 ${a.startTime}`);
          const timeB = new Date(`2000/01/01 ${b.startTime}`);
          return timeB - timeA;
        });
      case 4: // Highest Rating (assuming a static rating for demo)
        return [...result].sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
      case 5: // Price: Low to High
        return [...result].sort((a, b) => 
          (a.listVehicle[0]?.price || 0) - (b.listVehicle[0]?.price || 0)
        );
      case 6: // Price: High to Low
        return [...result].sort((a, b) => 
          (b.listVehicle[0]?.price || 0) - (a.listVehicle[0]?.price || 0)
        );
      default: // Default sorting (original order)
        return result;
    }
  }, [DataTripStaion, filters, sortOption]);

  const sortingOptions = [
    { id: 1, label: t('booking.sort.default') },
    { id: 2, label: t('booking.sort.earliestDeparture') },
    { id: 3, label: t('booking.sort.latestDeparture') },
    { id: 5, label: t('booking.sort.priceAscending') },
    { id: 6, label: t('booking.sort.priceDescending') },
  ];

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      timeRange: [],
      selectedGarages: [],
      priceRange: [0, 1000000],
    });
    setSortOption(1); // Reset sort to default
  };

  const handleSortChange = (sortId) => {
    setSortOption(sortId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Filter and Sort Section */}
      <div className="lg:col-span-1 space-y-4">
        {/* Sort */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <BookingSort 
            options={sortingOptions} 
            selectedOption={sortOption}
            onSortChange={handleSortChange}
          />
        </div>
        {/* Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <BookingFilter 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            availableGarages={[...new Set(DataTripStaion.map(trip => trip.fullName))]}
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="lg:col-span-3">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {t('booking.results.title')}:{' '}
            <span className="text-blue-600">
              {processedData?.length || 0} {t('booking.results.trips')}
            </span>
          </h2>
        </div>
        <DataTrip data={processedData} />
      </div>
    </div>
  );
}
