import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { message } from "antd";
import Header from "./Header";
import Footer from "./Footer";
import { FiUser, FiLock } from 'react-icons/fi';
import { Link } from "react-router-dom";
import { AppContext } from "../context/app.context";

const Login = () => {
  const { setProfile } = useContext(AppContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      message.error(t('auth.validation.required'));
      return;
    }

    setLoading(true);
    try {
      const loginRequestData = {
        id: 0,
        username: formData.username,
        email: "string",
        numberPhone: "string",
        password: formData.password,
        roleName: "string",
      };

      const { data } = await axios.post(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Auth/login",
        loginRequestData
      );

      if (data?.token) {
        message.success(t("auth.login.success"));
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
          localStorage.setItem(
            "profile",
            JSON.stringify(profileResponse.data)
          );
        }
        navigate("/");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      message.error(err?.response?.data || t("auth.login.error"));
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
            {t('auth.login.title')}
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('auth.login.username')}
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('auth.login.usernamePlaceholder')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('auth.login.password')}
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('auth.login.passwordPlaceholder')}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors
                ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? t('auth.validation.processing') : t('auth.login.submit')}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              {t('auth.login.noAccount')}
              <Link
                to="/register"
                className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                {t('auth.login.signUp')}
              </Link>
            </p>
            <Link to="/forgot-password">
              <button
                type="button"
                className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                {t('auth.login.forgotPassword')}
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
