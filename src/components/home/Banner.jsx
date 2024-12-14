import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiClock, FiMapPin, FiCalendar, FiSearch } from 'react-icons/fi';
import { FaBus } from 'react-icons/fa';
import { TbBus } from 'react-icons/tb';
import { useState } from 'react';

const Banner = () => {
    const { t } = useTranslation();
    const [searchData, setSearchData] = useState({
        from: '',
        to: '',
        date: ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        // Handle search logic here
        console.log('Search data:', searchData);
    };

    const tabs = [
        {
            icon: <FaBus className="w-5 h-5" />,
            label: t('home.banner.tabs.bus'),
            to: "/booking-car",
            active: true
        },
        {
            icon: <TbBus className="w-5 h-5" />,
            label: t('home.banner.tabs.shared'),
            to: "/Convenient",
            badge: "Vé Tết"
        },
        {
            icon: <FiClock className="w-5 h-5" />,
            label: t('home.banner.tabs.rental'),
            to: "/renter",
            badge: "Mới"
        }
    ];

    return (
        <div className="relative bg-gray-50">
            {/* Banner Image */}
            <div className="relative h-[600px] w-full overflow-hidden">
                <img
                    src="https://i.imgur.com/LVM6HVU.png"
                    alt={t('home.banner.subtitle')}
                    className="w-full h-full object-cover"
                />

                {/* Content Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50">
                    <div className="container mx-auto px-4 h-full flex items-center">
                        <div className="w-full max-w-3xl">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                {t('home.banner.title')}
                            </h1>
                            <p className="text-xl text-white/90 mb-8">
                                {t('home.banner.subtitle')}
                            </p>

                            {/* Service Tabs */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <div className="flex space-x-4 mb-6">
                                    {tabs.map((tab, index) => (
                                        <Tab
                                            key={index}
                                            {...tab}
                                        />
                                    ))}
                                </div>

                                {/* Search Form */}
                                <form onSubmit={handleSearch} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

                                    </div>
                                    <Link to="/booking-car">
                                        <button
                                            type="submit"
                                            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            <FiSearch className="w-5 h-5" />
                                            <span>{t('home.banner.search.searchButton')}</span>
                                        </button>
                                    </Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Tab = ({ icon, label, to, active, badge }) => (
    <Link
        to={to}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors relative
      ${active
                ? 'bg-blue-50 text-blue-600'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
    >
        {icon}
        <span className="font-medium">{label}</span>
        {badge && (
            <span className={`absolute -top-2 -right-2 px-2 py-0.5 text-xs font-medium rounded-full
        ${badge === 'Mới'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-orange-100 text-orange-800'
                }`}>
                {badge}
            </span>
        )}
    </Link>
);

export default Banner; 