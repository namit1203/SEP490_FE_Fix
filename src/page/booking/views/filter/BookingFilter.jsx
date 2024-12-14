import { useTranslation } from 'react-i18next';
import { Slider, Checkbox } from 'antd';
import { useState } from 'react';

export default function BookingFilter({ filters, onFilterChange, onClearFilters, availableGarages }) {
  const { t } = useTranslation();

  const handleTimeRangeChange = (value) => {
    onFilterChange({ timeRange: value });
  };

  const handleGarageChange = (checkedValues) => {
    onFilterChange({ selectedGarages: checkedValues });
  };

  const handlePriceRangeChange = (value) => {
    onFilterChange({ priceRange: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('booking.filter.title')}
        </h3>
        <button 
          onClick={onClearFilters}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
        >
          {t('booking.filter.clearAll')}
        </button>
      </div>

      <div className="space-y-6 divide-y divide-gray-200">
        {/* Time Filter */}
        <div className="pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">
            {t('booking.filter.timeRange')}
          </h4>
          <Slider
            range
            min={0}
            max={24}
            value={filters.timeRange}
            onChange={handleTimeRangeChange}
            marks={{
              0: '00:00',
              6: '06:00',
              12: '12:00',
              18: '18:00',
              24: '24:00'
            }}
          />
        </div>

        {/* Garage Filter */}
        <div className="pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">
            {t('booking.filter.garages')}
          </h4>
          <Checkbox.Group
            value={filters.selectedGarages}
            onChange={handleGarageChange}
            className="flex flex-col gap-2"
          >
            {availableGarages.map(garage => (
              <Checkbox key={garage} value={garage}>
                {t(`booking.filter.operators.${garage}`) || garage}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>

        {/* Price Filter */}
        <div className="pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">
            {t('booking.filter.priceRange')}
          </h4>
          <Slider
            range
            min={0}
            max={1000000}
            step={10000}
            value={filters.priceRange}
            onChange={handlePriceRangeChange}
            tipFormatter={value => `${value.toLocaleString()}đ`}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{filters.priceRange[0].toLocaleString()}đ</span>
            <span>{filters.priceRange[1].toLocaleString()}đ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
