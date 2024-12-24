import { Avatar } from "antd";
import { useContext, useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/app.context";
import { checkLoginToken } from "../utils";
import { useTranslation } from "react-i18next";
import { FiGlobe } from "react-icons/fi";
import LoginModal from "../components/auth/LoginModal";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const navigate = useNavigate();
  const dropdown = useRef(null);
  const langDropdown = useRef(null);
  const { profile } = useContext(AppContext);
  const { t, i18n } = useTranslation();
  const isLoggedIn = checkLoginToken();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdown.current && !langDropdown.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
      if (dropdown.current && !dropdown.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangDropdownOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm fixed w-full top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="block">
                <img
                  src="https://i.imgur.com/N8dxcgA.png"
                  alt="logo"
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Right Side Menu */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="relative" ref={langDropdown}>
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none transition-colors duration-200"
                >
                  <FiGlobe className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {i18n.language === "vi"
                      ? "VI"
                      : i18n.language === "en"
                      ? "EN"
                      : "中国人"}
                  </span>
                </button>

                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 transform transition-all duration-200">
                    <button
                      onClick={() => changeLanguage("en")}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                        i18n.language === "en"
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => changeLanguage("vi")}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                        i18n.language === "vi"
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Tiếng Việt
                    </button>
                    <button
                      onClick={() => changeLanguage("cn")}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                        i18n.language === "cn"
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      中国人
                    </button>
                  </div>
                )}
              </div>

              {isLoggedIn ? (
                <div className="relative">
                  <button
                    ref={dropdown}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-3 focus:outline-none"
                  >
                    <span className="hidden lg:block text-right">
                      <span className="block text-sm font-medium text-gray-700">
                        {profile?.username || "Guest"}
                      </span>
                    </span>
                    <Avatar
                      src={
                        profile?.avatar ||
                        "https://statics.oeg.vn/storage/DEFAULT%20AVATAR%20PROFILE/akirofemalev9.webp"
                      }
                      className="w-8 h-8"
                    />
                  </button>

                  {dropdownOpen && (
                    <div
                      ref={dropdown}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t("header.profile")}
                      </Link>
                      <button
                        onClick={() => {
                          localStorage.clear();
                          sessionStorage.clear();
                          navigate("/");
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t("logout")}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setOpenLogin(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t("header.login")}
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Login Modal */}
      <LoginModal isOpen={openLogin} onClose={() => setOpenLogin(false)} />
    </>
  );
};

export default Header;
