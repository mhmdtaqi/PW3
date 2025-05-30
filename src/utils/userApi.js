// User API utilities for fetching user data
import { useState } from 'react';

export const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch('https://brainquiz0.up.railway.app/user/get-user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        throw new Error('Authentication failed');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data) {
      const userData = data.data;

      // Store user data in localStorage for offline access
      localStorage.setItem('userId', userData.ID.toString());
      localStorage.setItem('role', userData.role);
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userEmail', userData.email);

      return {
        id: userData.ID,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: userData.CreatedAt,
        updatedAt: userData.UpdatedAt
      };
    } else {
      throw new Error(data.message || 'Failed to fetch user data');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const getUserFromStorage = () => {
  try {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    if (userId && role && userName) {
      return {
        id: parseInt(userId),
        name: userName,
        email: userEmail,
        role: role
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting user from storage:', error);
    return null;
  }
};

export const clearUserData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
};

// Hook for user data with automatic refresh
export const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get from storage first
      const storageData = getUserFromStorage();
      if (storageData) {
        setUserData(storageData);
      }

      // Then fetch fresh data from API
      const freshData = await fetchUserData();
      setUserData(freshData);
    } catch (err) {
      console.error('Error refreshing user data:', err);
      setError(err.message);

      // If API fails, try to use storage data
      const storageData = getUserFromStorage();
      if (storageData) {
        setUserData(storageData);
      } else {
        // If no storage data and API fails, user needs to login again
        clearUserData();
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    userData,
    loading,
    error,
    refreshUserData
  };
};
