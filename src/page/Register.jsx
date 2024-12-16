import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { message } from "antd";
import Header from "./Header";
import Footer from "./Footer";
import { FiUser, FiLock, FiMail, FiPhone } from 'react-icons/fi';
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    numberPhone: "",
    dob: "",
  });
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])(?=\S+$)[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Auth/confirm",
        {
          email: formData.email,
          code: otpInput,
        }
      );

      if (response.status === 200) {
        message.success(t('auth.otp.success'));
        setIsOtpMode(false);
        navigate("/login");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      message.error(err?.response?.data || t('auth.otp.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isOtpMode) {
      if (!otpInput.trim()) {
        return message.error(t('auth.otp.required'));
      }
      return handleVerifyOtp();
    }
    
    // Validation
    if (!validateEmail(formData.email)) {
      message.error(t('auth.validation.invalidEmail'));
      return;
    }

    if (!formData.username.trim()) {
      message.error(t('auth.register.usernameRequired'));
      return;
    }

    if (!validatePassword(formData.password)) {
      message.error(t('auth.register.passwordValidate'));
      return;
    }

    if (!formData.numberPhone.trim()) {
      message.error(t('auth.register.phonenumberRequired'));
      return;
    }

    if (!formData.dob.trim()) {
      message.error(t('auth.register.dobRequired'));
      return;
    }

    setLoading(true);
    try {
      const registerRequestData = {
        ...formData,
        id: 0,
      };

      const { data } = await axios.post(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Auth/register",
        registerRequestData
      );

      if (data) {
        message.success(t('auth.register.success'));
        setIsOtpMode(true);
      }
    } catch (err) {
      console.error("Registration error:", err);
      message.error(err?.response?.data || t('auth.register.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-6">
            {isOtpMode ? t('auth.otp.title') : t('auth.register.title')}
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isOtpMode ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('auth.otp.label')}
                </label>
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('auth.otp.placeholder')}
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('auth.register.email')}
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('auth.register.emailPlaceholder')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('auth.register.username')}
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('auth.register.usernamePlaceholder')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('auth.register.phonenumber')}
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="numberPhone"
                      value={formData.numberPhone}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('auth.register.phonenumberPlaceholder')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('auth.register.dob')}
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('auth.register.password')}
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('auth.register.passwordPlaceholder')}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors
                ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading 
                ? t('auth.validation.processing') 
                : isOtpMode 
                  ? t('auth.otp.submit')
                  : t('auth.register.submit')}
            </button>
          </form>

          {/* Footer */}
          {!isOtpMode && (
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                {t('auth.register.hasAccount')}
                <Link
                  to="/login"
                  className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t('auth.register.signIn')}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;
