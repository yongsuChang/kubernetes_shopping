import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import Spinner from '../common/Spinner/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { token, role } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulate or perform token verification check
    // In a real app, you might call a /me endpoint here
    const verifyToken = async () => {
      // Small delay to ensure state is loaded and to show loading state as requested
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsVerifying(false);
    };

    verifyToken();
  }, [token]);

  if (isVerifying) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner />
        <p style={{ marginLeft: '10px' }}>Verifying authentication...</p>
      </div>
    );
  }

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to home if role not authorized
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
