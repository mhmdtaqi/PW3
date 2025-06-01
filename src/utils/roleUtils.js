// Role-based access control utilities
import { getUserFromStorage } from './userApi';

export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',  // Database uses 'teacher'
  STUDENT: 'student'   // Database uses 'student'
};

export const getUserRole = () => {
  // Try to get from user data first (more reliable)
  const userData = getUserFromStorage();
  if (userData && userData.role) {
    return userData.role;
  }

  // Fallback to localStorage
  return localStorage.getItem('role') || ROLES.STUDENT;
};

export const getUserName = () => {
  const userData = getUserFromStorage();
  if (userData && userData.name) {
    return userData.name;
  }

  // Fallback to localStorage or default
  return localStorage.getItem('userName') || 'Pengguna';
};

export const getUserId = () => {
  const userData = getUserFromStorage();
  if (userData && userData.id) {
    return userData.id;
  }

  // Fallback to localStorage
  const storedId = localStorage.getItem('userId');
  return storedId ? parseInt(storedId) : null;
};

export const isAdmin = () => {
  return getUserRole() === ROLES.ADMIN;
};

export const isTeacher = () => {
  return getUserRole() === ROLES.TEACHER;
};

export const isStudent = () => {
  return getUserRole() === ROLES.STUDENT;
};

// Check if user can access specific features
export const canAccessFeature = (feature) => {
  const role = getUserRole();

  const permissions = {
    // Admin can access everything
    [ROLES.ADMIN]: [
      'kategori', 'tingkatan', 'pendidikan', 'kelas', 'kuis',
      'soal', 'jawab-kuis', 'hasil-kuis', 'manage-all'
    ],

    // Teacher cannot access master data (kategori, tingkatan, pendidikan)
    [ROLES.TEACHER]: [
      'kelas', 'kuis', 'soal', 'jawab-kuis', 'hasil-kuis'
    ],

    // Student can only view kelas (read-only), take quiz, and view results
    [ROLES.STUDENT]: [
      'kelas-view', 'jawab-kuis', 'hasil-kuis'
    ]
  };

  return permissions[role]?.includes(feature) || false;
};

// Check if user can perform specific actions
export const canPerformAction = (action) => {
  const role = getUserRole();

  const actionPermissions = {
    [ROLES.ADMIN]: [
      'create', 'read', 'update', 'delete', 'manage'
    ],

    [ROLES.TEACHER]: [
      'create', 'read', 'update', 'delete' // For allowed features only
    ],

    [ROLES.STUDENT]: [
      'read', 'take-quiz', 'view-results'
    ]
  };

  return actionPermissions[role]?.includes(action) || false;
};

// Get role display name
export const getRoleDisplayName = (role) => {
  const roleNames = {
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.TEACHER]: 'Guru',
    [ROLES.STUDENT]: 'Siswa'
  };

  return roleNames[role] || 'Pengguna';
};

// Get role emoji
export const getRoleEmoji = (role) => {
  const roleEmojis = {
    [ROLES.ADMIN]: '👑',
    [ROLES.TEACHER]: '👨‍🏫',
    [ROLES.STUDENT]: '👨‍🎓'
  };

  return roleEmojis[role] || '👤';
};

// Check if user can access navigation item
export const canAccessNavItem = (navItem) => {
  const role = getUserRole();

  // Define which nav items each role can access
  const navPermissions = {
    [ROLES.ADMIN]: [
      'dashboard', 'kategori', 'tingkatan', 'pendidikan', 'kelas',
      'kuis', 'kuis-siswa', 'hasil-kuis'
    ],

    [ROLES.TEACHER]: [
      'dashboard', 'kelas', 'kuis', 'kuis-siswa', 'hasil-kuis'
    ],

    [ROLES.STUDENT]: [
      'dashboard', 'kelas', 'kuis-siswa', 'hasil-kuis'
    ]
  };

  return navPermissions[role]?.includes(navItem) || false;
};

// Get allowed features for current role
export const getAllowedFeatures = () => {
  const role = getUserRole();

  const features = {
    [ROLES.ADMIN]: {
      masterData: ['kategori', 'tingkatan', 'pendidikan', 'kelas'],
      quiz: ['kelola-kuis', 'ikut-kuis', 'hasil-kuis'],
      actions: ['create', 'read', 'update', 'delete']
    },

    [ROLES.TEACHER]: {
      masterData: ['kelas'],
      quiz: ['kelola-kuis', 'ikut-kuis', 'hasil-kuis'],
      actions: ['create', 'read', 'update', 'delete']
    },

    [ROLES.STUDENT]: {
      masterData: ['kelas-view'],
      quiz: ['ikut-kuis', 'hasil-kuis'],
      actions: ['read', 'take-quiz']
    }
  };

  return features[role] || features[ROLES.STUDENT];
};
