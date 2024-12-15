import { Input } from "antd";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function GarageFilter() {
  const { t } = useTranslation();
  const garageOptions = [
    { id: 1, name: "Xe khách A" },
    { id: 2, name: "Xe khách B" },
    { id: 3, name: "Xe khách C" },
    { id: 4, name: "Xe khách D" },
  ];

  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGarages, setFilteredGarages] = useState(garageOptions);
  const [selectedGarages, setSelectedGarages] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = garageOptions.filter((garage) =>
      garage.name.toLowerCase().includes(value)
    );
    setFilteredGarages(filtered);
  };

  const handleGarageSelect = (garage) => {
    setSelectedGarages(prev =>
      prev.some(item => item.id === garage.id)
        ? prev.filter(item => item.id !== garage.id)
        : [...prev, garage]
    );
  };

  return (
    <div className="py-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full group"
      >
        <h4 className="text-base font-semibold text-gray-900 group-hover:text-gray-700">
          {t('booking.filter.operator.title')}
        </h4>
        {isExpanded ? (
          <FiChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <FiChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <Input
            placeholder={t('booking.filter.operator.searchPlaceholder')}
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
          />

          <div className="max-h-48 overflow-y-auto rounded-md border border-gray-200">
            {filteredGarages.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredGarages.map((garage) => (
                  <button
                    key={garage.id}
                    onClick={() => handleGarageSelect(garage)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                      selectedGarages.some(item => item.id === garage.id)
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700'
                    }`}
                  >
                    {garage.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                {t('booking.filter.operator.noResults')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
