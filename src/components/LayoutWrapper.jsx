import { useState, useCallback } from 'react';
import SideNavbar from './SideNavbar';

const LayoutWrapper = ({ children }) => {
  const [sidebarState, setSidebarState] = useState({
    isCollapsed: false,
    isMobileMenuOpen: false
  });

  const handleSidebarToggle = useCallback((state) => {
    setSidebarState(state);
  }, []);

  // Calculate main content margin based on sidebar state
  const getMainContentClass = () => {
    const { isCollapsed, isMobileMenuOpen } = sidebarState;
    
    // Mobile: no margin when menu closed, full width when open
    // Desktop: margin based on collapsed state
    return `transition-all duration-300 ${
      // Mobile
      'lg:ml-0 ' +
      // Desktop
      (isCollapsed ? 'lg:ml-16' : 'lg:ml-64')
    }`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <SideNavbar onSidebarToggle={handleSidebarToggle} />
      
      <main className={getMainContentClass()}>
        {children}
      </main>
    </div>
  );
};

export default LayoutWrapper;
