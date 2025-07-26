import React, { useState, useEffect } from 'react';
import './Layout.css';
import Sidebar from '../Sidebar/Sidebar';

const Layout = ({ children }) => {
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // State for mobile overlay menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Effect to check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine if the sidebar should be visually open
  const isSidebarOpen = !isMobile && (isSidebarPinned || isSidebarHovered);

  // Toggle function for mobile and desktop
  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsSidebarPinned(!isSidebarPinned);
    }
  };

  return (
    <div className="app-layout">
      {/* Backdrop for mobile overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      <div
        className="sidebar-wrapper"
        onMouseEnter={() => !isMobile && setIsSidebarHovered(true)}
        onMouseLeave={() => !isMobile && setIsSidebarHovered(false)}
      >
        <Sidebar
          isOpen={isMobile ? isMobileMenuOpen : isSidebarOpen}
          isPinned={isSidebarPinned}
          togglePin={toggleSidebar}
        />
      </div>

      <main className={`page-content ${!isMobile && isSidebarPinned ? 'pinned' : ''}`}>
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
