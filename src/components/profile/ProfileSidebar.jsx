import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import {
    FaUserCircle,
    FaUser,
    FaBox,
    FaGift,
    FaCreditCard,
    FaPowerOff
} from 'react-icons/fa';

const ProfileSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const menuItems = [
        { 
            icon: <FaUserCircle className="text-xl" />, 
            text: t('accountInfo'), 
            path: '/profile'
        },
        { 
            icon: <FaUser className="text-xl" />, 
            text: `${t('member')} ${t('regular')}`, 
            path: '/profile/reward-point' 
        },
        { 
            icon: <FaBox className="text-xl" />, 
            text: t('myOrders'), 
            path: '/profile/my-order' 
        },
        { 
            icon: <FaGift className="text-xl" />, 
            text: t('offers'), 
            path: '/profile/my-promotion' 
        },
        { 
            icon: <FaCreditCard className="text-xl" />, 
            text: t('changePassword'), 
            path: '/profile/change-pass' 
        },
      
        { 
            icon: <FaPowerOff className="text-xl" />, 
            text: t('logout'), 
            path: '/logout' 
        }
    ];

    const isActive = (path) => {
        if (path === '/profile') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const handleClick = (path) => {
        if (path === '/logout') {
            localStorage.clear();
            sessionStorage.clear();
            navigate('/');
        } else {
            navigate(path);
        }
    };

    return (
        <ul className="space-y-4">
            {menuItems.map((item, index) => (
                <li
                    key={index}
                    onClick={() => handleClick(item.path)}
                    className={`flex items-center cursor-pointer px-4 py-2 rounded-lg transition-all duration-200
                        ${isActive(item.path)
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    <span className="mr-3">{item.icon}</span>
                    <span className="font-medium">{item.text}</span>
                </li>
            ))}
        </ul>
    );
};

export default ProfileSidebar; 