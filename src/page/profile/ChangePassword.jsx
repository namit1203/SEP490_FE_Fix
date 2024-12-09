import React, { useContext, useState } from "react";
import { useTranslation } from 'react-i18next';
import { AppContext } from "../../context/app.context";
import { checkLoginToken } from "../../utils";
import { message } from 'antd';

const ChangePassword = () => {
  const { profile } = useContext(AppContext);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const currentEmail = profile?.email || localStorage.getItem("email"); // Lấy email từ profile hoặc localStorage

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Regular expression for password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_])[A-Za-z\d!@#$%^&*()_]{7,}$/;

    // Check if new password and confirmation match
    if (formData.newPassword !== formData.confirmPassword) {
        message.error(t('profile.password.mismatch'));
        return;
    }

    // Check password strength using regex
    if (!passwordRegex.test(formData.newPassword)) {
        message.error(t('profile.password.invalid')); // Add this message to your translations
        return;
    }

    try {
        const response = await fetch(
            `https://boring-wiles.202-92-7-204.plesk.page/api/User/ChangePassword/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    accept: "*/*",
                    Authorization: "Bearer " + checkLoginToken(),
                },
                body: JSON.stringify({
                    currentEmail, // Include currentEmail in the payload
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword,
                }),
            }
        );

        if (response.ok) {
            message.success(t('profile.password.success'));
            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } else {
            message.error(t('profile.password.error'));
        }
    } catch (error) {
        console.error("Error:", error);
        message.error(t('profile.password.error'));
    }
};




  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">{t('profile.password.title')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">
            {t('profile.password.current')}<span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
        </div>
        <div>
          <label className="block text-gray-700">
            {t('profile.password.new')}<span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
        </div>
        <div>
          <label className="block text-gray-700">
            {t('profile.password.confirm')}<span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
        >
          {t('profile.password.update')}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
