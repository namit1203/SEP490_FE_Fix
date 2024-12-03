import { createContext, useEffect, useState } from "react";
import { getProfileFromLS } from "../utils";
export const initialAppContext = {
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  reset: () => null,
};
export const AppContext = createContext(initialAppContext);
export const AppProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setProfile(initialAppContext.profile);
  }, []);

  const reset = () => {
    setProfile(null);
  };
  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
