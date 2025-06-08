import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useRole } from '../hooks/useAuth';
import { hasPermission } from '../utils/roleUtils';

/**
 * Route Guard Component - Protects routes based on user role
 */
const RoleGuard = ({ children, requiredRole, requiredPermission, roles = [], fallbackPath = '/dashboard' }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { userRole } = useRole();

  console.log('🛡️ RoleGuard check:', {
    userRole,
    requiredRole,
    roles,
    requiredPermission,
    path: location.pathname
  });

  // Check multiple roles requirement
  if (roles.length > 0 && !roles.includes(userRole)) {
    console.log('❌ RoleGuard: User role not in allowed roles');
    return <Navigate to={fallbackPath} replace />;
  }

  // Check specific role requirement
  if (requiredRole && userRole !== requiredRole) {
    console.log('❌ RoleGuard: User role does not match required role');
    return <Navigate to={fallbackPath} replace />;
  }

  // Check specific permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    console.log('❌ RoleGuard: User does not have required permission');
    return <Navigate to={fallbackPath} replace />;
  }

  console.log('✅ RoleGuard: Access granted');
  return children;
};

export default RoleGuard;
