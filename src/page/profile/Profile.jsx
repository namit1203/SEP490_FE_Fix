import { useEffect, useState } from 'react';
import { Outlet } from "react-router-dom";
import Header from "../Header";
import ProfileSidebar from "../../components/profile/ProfileSidebar";
import Breadcrumb from "../../components/common/Breadcrumb";
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Profile = () => {
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState(null);

  const breadcrumbItems = [
    { text: 'home', path: '/' },
    { text: 'accountInfo' }
  ];

  // Fetch user profile data with token
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Lấy token từ localStorage hoặc sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          console.error('Authentication token not found');
          return;
        }

        // Gửi request với token trong header
        const response = await axios.get(
          'https://boring-wiles.202-92-7-204.plesk.page/api/Auth/userProfile',
          {
            headers: {
              Authorization: `Bearer ${token}` // Thêm token vào header
            }
          }
        );

        if (response.data && response.data.avatar) {
          setAvatar(response.data.avatar);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              {/* Profile Summary */}
              <div className="mb-6 text-center">
                <div className="w-24 h-24 mx-auto mb-4">
                  <img
                    src={avatar || "https://statics.oeg.vn/storage/DEFAULT%20AVATAR%20PROFILE/akirofemalev9.webp"}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-4 border-blue-50"
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {t('accountInfo')}
                </h2>
                <p className="text-sm text-gray-500">
                  {t('member')} - {t('regular')}
                </p>
              </div>
              
              {/* Navigation */}
              <ProfileSidebar />
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
