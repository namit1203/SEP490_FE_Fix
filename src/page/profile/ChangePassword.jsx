import { Input, message } from "antd";
import { useContext, useState } from "react";
import { AppContext } from "../../context/app.context";
import { checkLoginToken } from "../../utils";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const { profile } = useContext(AppContext);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: '', // Xóa lỗi khi người dùng nhập lại
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current Password is required";
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "New Password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "New Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm New Password is required";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "New Password and Confirm Password do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch('https://boring-wiles.202-92-7-204.plesk.page/api/User/ChangePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer " + checkLoginToken(),
          'accept': '*/*',
        },
        body: JSON.stringify({
          currentEmail: profile?.email,
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (response.ok) {
        message.success("Thay đổi mật khẩu thành công!");
      } else {
        message.error("Có lỗi xảy ra khi thay đổi mật khẩu!");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Có lỗi khi kết nối đến server!");
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full">
        <form id="changePasswordForm" className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 block mb-2">
              Current Password *
            </label>
            <Input
              type="password"
              id="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="password-input form-input block w-full border border-gray-300 rounded-md shadow-sm"
              
            />
            {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword}</p>}
          </div>
          <div>
            <label htmlFor="newPassword" className="text-sm font-medium text-gray-700 block mb-2">
              New Password *
            </label>
            <Input
              type="password"
              id="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="password-input form-input block w-full border border-gray-300 rounded-md shadow-sm"
              
            />
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block mb-2">
              Confirm New Password *
            </label>
            <Input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="password-input form-input block w-full border border-gray-300 rounded-md shadow-sm"
              
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
            >
              Apply Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
