import React from 'react';
import { useAuth, useRole } from '../../hooks/useAuth';

const RoleDisplay = ({ className = '' }) => {
  const { user } = useAuth();
  const { userRole, isAdmin, isTeacher, isStudent } = useRole();

  const getRoleInfo = () => {
    if (isAdmin()) {
      return {
        label: 'Administrator',
        icon: '👑',
        color: 'bg-red-100 text-red-800 border-red-200',
        description: 'Akses penuh ke semua fitur sistem'
      };
    }
    
    if (isTeacher()) {
      return {
        label: 'Guru',
        icon: '👨‍🏫',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        description: 'Dapat membuat dan mengelola kuis'
      };
    }
    
    if (isStudent()) {
      return {
        label: 'Siswa',
        icon: '👨‍🎓',
        color: 'bg-green-100 text-green-800 border-green-200',
        description: 'Dapat mengikuti kuis dan melihat hasil'
      };
    }
    
    return {
      label: 'Unknown',
      icon: '❓',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      description: 'Role tidak dikenali'
    };
  };

  const roleInfo = getRoleInfo();

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border ${roleInfo.color} ${className}`}>
      <span className="text-lg">{roleInfo.icon}</span>
      <div>
        <div className="font-semibold text-sm">{roleInfo.label}</div>
        <div className="text-xs opacity-75">{roleInfo.description}</div>
      </div>
    </div>
  );
};

export default RoleDisplay;
