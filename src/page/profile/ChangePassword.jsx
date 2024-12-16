import { useContext, useState } from "react";
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

  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPopup, setShowPopup] = useState(false);

  const passwordRegex = /^(?=.*[A-Z])(?=.*[~!@#$%^&*]).{6,}$/;

  const currentEmail = profile?.email || localStorage.getItem("email"); // Lấy email từ profile hoặc localStorage

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Xử lý validate ngay trong textbox
    if (name === "newPassword") {
      if (!passwordRegex.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          newPassword: t('profile.password.invalid'),
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          newPassword: "",
        }));
      }
    }

    if (name === "confirmPassword") {
      if (value !== formData.newPassword) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: t('profile.password.mismatch'),
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra lỗi trước khi gửi
    if (errors.newPassword || errors.confirmPassword) {
      message.error(t('profile.password.fixErrors'));
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
        {/* Mật khẩu hiện tại */}
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

        {/* Mật khẩu mới */}
        <div className="relative">
          <label className="block text-gray-700">
            {t('profile.password.new')}
            <span
              className="text-red-500 cursor-pointer"
              onMouseEnter={() => setShowPopup(true)}
              onMouseLeave={() => setShowPopup(false)}
            >
              *
            </span>
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
          {errors.newPassword && (
            <span className="text-red-500 text-sm">{errors.newPassword}</span>
          )}

          {/* Popup hiển thị thông báo */}
          {showPopup && (
            <div className="absolute bg-gray-100 border border-gray-300 rounded p-2 text-sm text-gray-700 shadow-md mt-1">
              {t('profile.password.popupMessage')} {/* Thêm nội dung vào file translation */}
            </div>
          )}
        </div>

        {/* Xác nhận mật khẩu */}
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
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">{errors.confirmPassword}</span>
          )}
        </div>

        {/* Nút cập nhật */}
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
