import React from 'react';
import { getUserRole } from '../utils/roleUtils';

const RoleIndicator = ({ className = "" }) => {
  const userRole = getUserRole();

  const getRoleInfo = (role) => {
    switch (role) {
      case 'admin':
        return {
          name: 'Administrator',
          icon: '👑',
          color: 'bg-red-100 text-red-800 border-red-200',
          description: 'Full system access'
        };
      case 'teacher':
        return {
          name: 'Guru',
          icon: '👨‍🏫',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          description: 'Manage quizzes and classes'
        };
      case 'student':
        return {
          name: 'Siswa',
          icon: '🎓',
          color: 'bg-green-100 text-green-800 border-green-200',
          description: 'Take quizzes and learn'
        };
      default:
        return {
          name: 'Pengguna',
          icon: '👤',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          description: 'Basic access'
        };
    }
  };

  const roleInfo = getRoleInfo(userRole);

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border ${roleInfo.color} ${className}`}>
      <span className="text-lg">{roleInfo.icon}</span>
      <div className="text-sm">
        <div className="font-semibold">{roleInfo.name}</div>
        <div className="text-xs opacity-75">{roleInfo.description}</div>
      </div>
    </div>
  );
};

export default RoleIndicator;
