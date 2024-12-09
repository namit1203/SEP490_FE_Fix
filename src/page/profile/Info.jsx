import { useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { AppContext } from "../../context/app.context";
import { checkLoginToken } from "../../utils";
import { message } from "antd";

const Info = () => {
  const { profile } = useContext(AppContext);
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    numberPhone: "",
    avatar: "",
    fullName: "",
    address: "",
    dob: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile?.username || "",
        email: profile?.email || "",
        numberPhone: profile?.numberPhone || "",
        avatar: profile?.avatar || "https://statics.oeg.vn/storage/DEFAULT%20AVATAR%20PROFILE/akirofemalev9.webp",
        fullName: profile?.fullName || "",
        address: profile?.address || "",
        dob: profile?.dob?.split("T")?.[0] || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `https://boring-wiles.202-92-7-204.plesk.page/api/User/EditProfile/${profile.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
            Authorization: "Bearer " + checkLoginToken(),
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        message.success(t('profile.info.updateSuccess'));
      } else {
        message.error(t('profile.info.updateError'));
      }
    } catch (error) {
      console.error("Error:", error);
      message.error(t('profile.info.updateError'));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {t('profile.info.title')}
      </h2>

      <div className="grid gap-6">
        {/* Profile Image */}
        <div className="flex items-center space-x-4">
          <img
            src={formData.avatar && formData.avatar !== "string" ? formData.avatar : "https://statics.oeg.vn/storage/DEFAULT%20AVATAR%20PROFILE/akirofemalev9.webp"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-4 border-blue-50"
          />
          <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
            {t('profile.info.changePhoto')}
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('profile.info.fullName')}<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('profile.info.email')}<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('profile.info.phone')}
            </label>
            <input
              type="tel"
              name="numberPhone"
              value={formData.numberPhone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('profile.info.date')}
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('profile.info.address')}
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200 resize-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium transition-all duration-200"
          >
            {t('profile.info.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Info;
