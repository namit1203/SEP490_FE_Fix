import { createContext, useEffect, useState } from "react";
import { getProfileFromLS, checkLoginToken } from "../utils";

export const initialAppContext = {
  isAuthenticated: Boolean(getProfileFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  reset: () => null,
};

export const AppContext = createContext(initialAppContext);

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAppContext.isAuthenticated);
  const [profile, setProfile] = useState(initialAppContext.profile);

  useEffect(() => {
    const checkAuth = () => {
      const token = checkLoginToken();
      if (!token) {
        reset();
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const reset = () => {
    setIsAuthenticated(false);
    setProfile(null);
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
