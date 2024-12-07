import { message } from "antd";
import axios from "axios";
import { useContext, useState } from "react";
import { useTranslation } from 'react-i18next';
import { AppContext } from "../../context/app.context";
import { FiX, FiMail, FiLock, FiUser } from 'react-icons/fi';

const LoginModal = ({ isOpen, onClose }) => {
  const { setProfile } = useContext(AppContext);
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("login");
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
        setIsLoading(true);
        if (activeTab === "login") {
            const loginRequestData = {
                id: 0, // Default or placeholder value
                username: loginData.username, // User input
                email: "string", // Placeholder, can be adjusted
                numberPhone: "string", // Placeholder, can be adjusted
                password: loginData.password, // User input
                roleName: "string", // Placeholder, can be adjusted
            };

            const { data } = await axios.post(
                "https://boring-wiles.202-92-7-204.plesk.page/api/Auth/login",
                loginRequestData
            );

            if (data?.token) {
                message.success(t('auth.login.success'));
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role || "");
                localStorage.setItem("userName", data.userName || "");

                const profileResponse = await axios.get(
                    "https://boring-wiles.202-92-7-204.plesk.page/api/Auth/userProfile",
                    {
                        headers: { Authorization: `Bearer ${data.token}` },
                    }
                );

                if (profileResponse?.data) {
                    setProfile(profileResponse.data);
                    localStorage.setItem("profile", JSON.stringify(profileResponse.data));
                }
                onClose();
            }
        } else {
            const { data } = await axios.post(
                "https://boring-wiles.202-92-7-204.plesk.page/api/Auth/register",
                signupData
            );

            if (data) {
                message.success(t('auth.register.success'));
                setActiveTab("login");
                setIsOtpMode(true);
            }
        }
    } catch (err) {
        console.error('Authentication error:', err);
        message.error(t('auth.login.error'));
    } finally {
        setIsLoading(false);
    }
};


  const handleVerifyOtp = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Auth/confirm",
        {
          email: signupData.email,
          code: otpInput,
        }
      );

      if (response.data) {
        message.success(t('auth.otp.success'));
        setIsOtpMode(false);
        setActiveTab("login");
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      message.error(t('auth.otp.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (activeTab === "login" && !loginData.username.trim()) {
      return message.error(t('auth.login.usernameRequired'));
    }
    if (activeTab === "login" && !loginData.password) {
      return message.error(t('auth.login.passwordRequired'));
    }
    if (activeTab === "signup") {
      if (!signupData.email.trim()) {
        return message.error(t('auth.register.emailRequired'));
      }
      if (!signupData.username.trim()) {
        return message.error(t('auth.register.usernameRequired'));
      }
      if (!signupData.password) {
        return message.error(t('auth.register.passwordRequired'));
      }
    }
    if (isOtpMode && !otpInput.trim()) {
      return message.error(t('auth.otp.required'));
    }

    isOtpMode ? handleVerifyOtp() : handleLogin();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6">
          {isOtpMode ? t('auth.otp.title') : activeTab === "login" ? t('auth.login.title') : t('auth.register.title')}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "signup" && !isOtpMode && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{t('auth.register.email')}</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('auth.register.emailPlaceholder')}
                />
              </div>
            </div>
          )}

          {!isOtpMode && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">{t('auth.login.username')}</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={activeTab === "login" ? loginData.username : signupData.username}
                    onChange={(e) => {
                      const value = e.target.value;
                      activeTab === "login"
                        ? setLoginData({ ...loginData, username: value })
                        : setSignupData({ ...signupData, username: value });
                    }}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('auth.register.usernamePlaceholder')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">{t('auth.login.password')}</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={activeTab === "login" ? loginData.password : signupData.password}
                    onChange={(e) => {
                      const value = e.target.value;
                      activeTab === "login"
                        ? setLoginData({ ...loginData, password: value })
                        : setSignupData({ ...signupData, password: value });
                    }}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('auth.register.passwordPlaceholder')}
                  />
                </div>
              </div>
            </>
          )}

          {isOtpMode && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{t('auth.otp.label')}</label>
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('auth.otp.placeholder')}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors
              ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? t('auth.login.processing') : isOtpMode ? t('auth.otp.submit') : activeTab === "login" ? t('auth.login.submit') : t('auth.register.submit')}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            {activeTab === "login" ? t('auth.login.noAccount') : t('auth.register.hasAccount')}
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}
              className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              {activeTab === "login" ? t('auth.login.signUp') : t('auth.register.signIn')}
            </button>
          </p>
          {activeTab === "login" && (
            <button
              type="button"
              onClick={() => window.location.href = "/forgot-password"}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('auth.login.forgotPassword')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
