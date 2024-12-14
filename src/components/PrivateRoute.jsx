import { Navigate, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AppContext } from '../context/app.context';
import { checkLoginToken } from '../utils';

export const PrivateRoute = ({ children }) => {
  const { profile, reset } = useContext(AppContext);
  const location = useLocation();
  
  useEffect(() => {
    const token = checkLoginToken();
    if (!token) {
      reset();
    }
  }, [reset]);

  if (!profile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
