// Role-Based Access Control (RBAC) Utilities
// Based on backend role system: admin, teacher, student

/**
 * Get user role from localStorage or token
 */
export const getUserRole = () => {
  // First try localStorage
  const storedRole = localStorage.getItem('role');
  if (storedRole) return storedRole;

  // Fallback to token
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || 'student'; // Default to student
    } catch (error) {
      console.error('Error decoding token for role:', error);
    }
  }

  return 'student'; // Default role
};

/**
 * Check if user has specific role
 */
export const hasRole = (requiredRole) => {
  const userRole = getUserRole();
  return userRole === requiredRole;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (roles) => {
  const userRole = getUserRole();
  return roles.includes(userRole);
};

/**
 * Role hierarchy check - higher roles include lower role permissions
 * admin > teacher > student
 */
export const hasRoleOrHigher = (requiredRole) => {
  const userRole = getUserRole();
  const roleHierarchy = {
    'student': 1,
    'teacher': 2,
    'admin': 3
  };

  const userLevel = roleHierarchy[userRole] || 1;
  const requiredLevel = roleHierarchy[requiredRole] || 1;

  return userLevel >= requiredLevel;
};

/**
 * Define permissions for each role based on backend access
 */
export const PERMISSIONS = {
  // Admin permissions - full access
  admin: {
    // User management
    viewUsers: true,
    createUsers: true,
    editUsers: true,
    deleteUsers: true,
    
    // Category management
    viewCategories: true,
    createCategories: true,
    editCategories: true,
    deleteCategories: true,
    
    // Level management
    viewLevels: true,
    createLevels: true,
    editLevels: true,
    deleteLevels: true,
    
    // Education management
    viewEducation: true,
    createEducation: true,
    editEducation: true,
    deleteEducation: true,
    
    // Class management
    viewClasses: true,
    createClasses: true,
    editClasses: true,
    deleteClasses: true,
    joinClasses: true,
    
    // Quiz management
    viewQuizzes: true,
    createQuizzes: true,
    editQuizzes: true,
    deleteQuizzes: true,
    takeQuizzes: true,
    
    // Question management
    viewQuestions: true,
    createQuestions: true,
    editQuestions: true,
    deleteQuestions: true,
    
    // Results and analytics
    viewOwnResults: true,
    viewAllResults: true,
    viewAnalytics: true,
    viewLeaderboard: true,
    
    // System features
    viewDashboard: true,
    viewSystemStats: true
  },

  // Teacher permissions - teaching and quiz management
  teacher: {
    // User management - limited
    viewUsers: false,
    createUsers: false,
    editUsers: false,
    deleteUsers: false,
    
    // Category management - view only
    viewCategories: true,
    createCategories: false,
    editCategories: false,
    deleteCategories: false,
    
    // Level management - view only
    viewLevels: true,
    createLevels: false,
    editLevels: false,
    deleteLevels: false,
    
    // Education management - view only
    viewEducation: true,
    createEducation: false,
    editEducation: false,
    deleteEducation: false,
    
    // Class management - full for own classes
    viewClasses: true,
    createClasses: true,
    editClasses: true,
    deleteClasses: true,
    joinClasses: true,
    
    // Quiz management - full
    viewQuizzes: true,
    createQuizzes: true,
    editQuizzes: true,
    deleteQuizzes: true,
    takeQuizzes: true,
    
    // Question management - full
    viewQuestions: true,
    createQuestions: true,
    editQuestions: true,
    deleteQuestions: true,
    
    // Results and analytics - own and students
    viewOwnResults: true,
    viewAllResults: false, // Only students in their classes
    viewAnalytics: true,
    viewLeaderboard: true,
    
    // System features
    viewDashboard: true,
    viewSystemStats: true
  },

  // Student permissions - learning focused
  student: {
    // User management - none
    viewUsers: false,
    createUsers: false,
    editUsers: false,
    deleteUsers: false,
    
    // Category management - view only
    viewCategories: true,
    createCategories: false,
    editCategories: false,
    deleteCategories: false,
    
    // Level management - view only
    viewLevels: true,
    createLevels: false,
    editLevels: false,
    deleteLevels: false,
    
    // Education management - view only
    viewEducation: true,
    createEducation: false,
    editEducation: false,
    deleteEducation: false,
    
    // Class management - join only
    viewClasses: true,
    createClasses: false,
    editClasses: false,
    deleteClasses: false,
    joinClasses: true,
    
    // Quiz management - take only
    viewQuizzes: true,
    createQuizzes: false,
    editQuizzes: false,
    deleteQuizzes: false,
    takeQuizzes: true,
    
    // Question management - view only during quiz
    viewQuestions: true,
    createQuestions: false,
    editQuestions: false,
    deleteQuestions: false,
    
    // Results and analytics - own only
    viewOwnResults: true,
    viewAllResults: false,
    viewAnalytics: true,
    viewLeaderboard: true,
    
    // System features
    viewDashboard: true,
    viewSystemStats: false
  }
};

/**
 * Check if user has specific permission
 */
export const hasPermission = (permission) => {
  const userRole = getUserRole();
  const rolePermissions = PERMISSIONS[userRole] || PERMISSIONS.student;
  return rolePermissions[permission] || false;
};

/**
 * Get all permissions for current user role
 */
export const getUserPermissions = () => {
  const userRole = getUserRole();
  return PERMISSIONS[userRole] || PERMISSIONS.student;
};

/**
 * Simple role-based route access check
 * Returns true for most routes, only blocks specific admin/teacher routes
 */
export const canAccessRoute = (route) => {
  const userRole = getUserRole();

  // Public routes - always accessible
  if (['/login', '/register'].includes(route)) {
    return true;
  }

  // Admin-only routes
  const adminOnlyRoutes = [
    '/daftar-kategori',
    '/tambah-kategori',
    '/edit-kategori',
    '/daftar-tingkatan',
    '/tambah-tingkatan',
    '/edit-tingkatan',
    '/daftar-pendidikan',
    '/tambah-pendidikan',
    '/edit-pendidikan'
  ];

  // Teacher and Admin routes
  const teacherAdminRoutes = [
    '/daftar-kuis',
    '/tambah-kuis',
    '/edit-kuis',
    '/daftar-soal',
    '/tambah-soal',
    '/edit-soal'
  ];

  // Check admin-only access
  if (adminOnlyRoutes.some(adminRoute => route.startsWith(adminRoute))) {
    return userRole === 'admin';
  }

  // Check teacher/admin access
  if (teacherAdminRoutes.some(teacherRoute => route.startsWith(teacherRoute))) {
    return userRole === 'teacher' || userRole === 'admin';
  }

  // All other routes are accessible to authenticated users
  return true;
};

/**
 * Get accessible menu items based on user role
 */
export const getAccessibleMenuItems = () => {
  const userRole = getUserRole();
  
  const allMenuItems = [
    // Student menu items
    { name: "Dashboard", path: "/dashboard", icon: "🏠", roles: ['student', 'teacher', 'admin'] },
    { name: "Ambil Kuis", path: "/ambil-kuis", icon: "📝", roles: ['student', 'teacher', 'admin'] },
    { name: "Hasil Kuis", path: "/hasil-kuis", icon: "📊", roles: ['student', 'teacher', 'admin'] },
    { name: "Analytics", path: "/analytics", icon: "📈", roles: ['student', 'teacher', 'admin'] },
    { name: "Rekomendasi", path: "/recommendations", icon: "🎯", roles: ['student', 'teacher', 'admin'] },
    { name: "Performance", path: "/leaderboard", icon: "📊", roles: ['student', 'teacher', 'admin'] },
    { name: "Achievements", path: "/achievements", icon: "🏆", roles: ['student', 'teacher', 'admin'] },
    { name: "Study Planner", path: "/study-planner", icon: "📅", roles: ['student', 'teacher', 'admin'] },
    
    // Teacher menu items
    { name: "Kelola Kuis", path: "/daftar-kuis", icon: "📚", roles: ['teacher', 'admin'] },
    { name: "Kelola Kelas", path: "/daftar-kelas", icon: "🏫", roles: ['teacher', 'admin'] },
    
    // Admin menu items
    { name: "Kelola Kategori", path: "/daftar-kategori", icon: "🏷️", roles: ['admin'] },
    { name: "Kelola Tingkatan", path: "/daftar-tingkatan", icon: "📊", roles: ['admin'] },
    { name: "Kelola Pendidikan", path: "/daftar-pendidikan", icon: "🎓", roles: ['admin'] }
  ];
  
  return allMenuItems.filter(item => item.roles.includes(userRole));
};
