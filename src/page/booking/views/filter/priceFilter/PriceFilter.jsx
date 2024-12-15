import { Slider } from "antd";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function PriceFilter() {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 2000000]);

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const formatPrice = (value) => {
    return `${value.toLocaleString('vi-VN')} ${t('booking.filter.price.currency')}`;
  };

  return (
    <div className="py-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full group"
      >
        <h4 className="text-base font-semibold text-gray-900 group-hover:text-gray-700">
          {t('booking.filter.price.title')}
        </h4>
        {isExpanded ? (
          <FiChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <FiChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-6">
          <Slider
            range
            min={0}
            max={2000000}
            step={50000}
            value={priceRange}
            onChange={handlePriceChange}
            tooltip={{
              formatter: formatPrice,
            }}
          />
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-900">{formatPrice(priceRange[0])}</span>
            <span className="font-medium text-gray-900">{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      )}
    </div>
  );
}
