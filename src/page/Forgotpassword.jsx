import { message } from "antd";
import axios from "axios";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiMail, FiKey } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const Forgotpassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResetStage, setIsResetStage] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      message.error(t('auth.validation.invalidEmail'));
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Auth/ForgotPassword",
        { email }
      );

      if (response.status === 200) {
        message.success(t('auth.forgotPassword.success'));
        setIsResetStage(true);
      }
    } catch (err) {
      const response = err.response;
      if (response && response.status === 404 && response.data.message === "Not found account") {
        message.error("Không tìm thấy tài khoản"); // Specific message for not found account
      } else {
        message.error(t('auth.forgotPassword.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      message.error(t('auth.validation.passwordMismatch'));
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Auth/ResetPassword",
        { email, code, password, confirmPassword }
      );

      if (response.status === 200) {
        message.success(t('auth.resetPassword.success'));
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      const response = err.response;
      if (response && response.status === 404 && response.data.message === "Not found account") {
        message.error("Không tìm thấy tài khoản"); // Specific message for not found account
      } else {
        message.error(t('auth.resetPassword.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isResetStage ? t('auth.resetPassword.title') : t('auth.forgotPassword.title')}
          </h2>

          <form onSubmit={isResetStage ? handleResetPassword : handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('auth.forgotPassword.email')}
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('auth.forgotPassword.emailPlaceholder')}
                  required
                />
              </div>
            </div>

            {isResetStage && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('auth.resetPassword.code')}
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('auth.resetPassword.newPassword')}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('auth.resetPassword.confirmPassword')}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors
                ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? t('auth.validation.processing') : isResetStage ? t('auth.resetPassword.submit') : t('auth.forgotPassword.submit')}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              {t('auth.forgotPassword.backToLogin')}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Forgotpassword;
