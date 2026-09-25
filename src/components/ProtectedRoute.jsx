import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/authStorage';

const ProtectedRoute = ({ role, redirectPath }) => {
  const location = useLocation();
  const defaultRedirect = 
    role === 'institute' ? '/institute/login' :
    role === 'employer' || role === 'industry' ? '/employer/login' :
    '/student/login';

  const isAuth = isAuthenticated(role);

  if (!isAuth) {
    return (
      <Navigate 
        to={redirectPath || defaultRedirect} 
        replace 
        state={{ 
          from: location.pathname, 
          authRequiredMessage: 'Access restricted. Please log in with a registered account to view the dashboard.' 
        }} 
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
