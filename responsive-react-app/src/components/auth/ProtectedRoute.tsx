import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import Spinner from '../common/Spinner/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { token, role } = useAuthStore();
  const location = useLocation();

  // 토큰이 없는 경우 즉시 로그인 페이지로 이동
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 역할이 로드되지 않은 경우 잠시 대기
  if (allowedRoles && !role) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner />
      </div>
    );
  }

  // 권한 체크
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    console.warn(`Access denied. Required: ${allowedRoles}, Current: ${role}`);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
