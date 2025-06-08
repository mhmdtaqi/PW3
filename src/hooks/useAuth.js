import { useState, useEffect } from 'react';

// Custom hook for authentication and user management
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get user info from localStorage and token
  const getUserInfo = () => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    const storedUserRole = localStorage.getItem('userRole');

    if (storedUserId && storedUserRole) {
      return {
        userId: storedUserId,
        userName: storedUserName || 'User',
        userRole: storedUserRole
      };
    }

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          userId: payload.iss || payload.user_id || payload.id || payload.sub,
          userName: payload.name || storedUserName || 'User',
          userRole: payload.role || storedUserRole || 'student'
        };
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    return {
      userId: null,
      userName: storedUserName || 'User',
      userRole: storedUserRole || 'student'
    };
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return !!(token && userId);
  };

  // Login function
  const login = (userData, token) => {
    const userRole = userData.role || userData.userRole;

    localStorage.setItem('token', token);
    localStorage.setItem('userId', userData.id || userData.userId);
    localStorage.setItem('userName', userData.name || userData.userName);
    localStorage.setItem('userRole', userRole);

    setUser({
      userId: userData.id || userData.userId,
      userName: userData.name || userData.userName,
      userRole: userRole
    });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    setUser(null);
  };

  // Initialize user on component mount
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo.userId) {
      setUser(userInfo);
    }
    setLoading(false);
  }, []);

  return {
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    login,
    logout,
    getUserInfo
  };
};

// Custom hook for user role checking
export const useRole = () => {
  const { user } = useAuth();
  
  const isAdmin = () => {
    return user?.userRole === 'admin';
  };
  
  const isTeacher = () => {
    return user?.userRole === 'teacher' || user?.userRole === 'admin';
  };
  
  const isStudent = () => {
    return user?.userRole === 'user' || user?.userRole === 'student';
  };

  return {
    userRole: user?.userRole || 'student', // Default to student instead of user
    isAdmin,
    isTeacher,
    isStudent
  };
};
