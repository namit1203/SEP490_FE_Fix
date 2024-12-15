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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <>
      {routeElements}
    </>
  );
}

export default App;
