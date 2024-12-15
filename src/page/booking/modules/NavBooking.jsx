import { useState } from "react";
import { useTranslation } from 'react-i18next';
import TripIcons from "../../../components/icons/trip";

export default function NavBooking() {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuItems = [
    { icon: <TripIcons />, label: t('booking.nav.bus') },
  ];

  const handleClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <nav className="border-b border-gray-200">
      <div className="flex justify-center">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={`
              flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors
              ${selectedIndex === index 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
