import useRouteElements from "./useRouter";
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

function App() {
  const routeElements = useRouteElements();
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng');
    if (!savedLang) {
      const defaultLang = 'en';
      i18n.changeLanguage(defaultLang);
      localStorage.setItem('i18nextLng', defaultLang);
    }
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => changeLanguage('en')}
          className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
            i18n.language === 'en'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          English
        </button>
        <button
          onClick={() => changeLanguage('vi')}
          className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
            i18n.language === 'vi'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tiếng Việt
        </button>
      </div>
      {routeElements}
    </>
  );
}

export default App;
