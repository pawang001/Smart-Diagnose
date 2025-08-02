import React, { useState } from 'react';
import {useWindowSize} from '../../Hooks/UseWindowSize'; // Import the new hook
import './Layout.css';
import Sidebar from '../Sidebar/Sidebar';

const Icon = ({ path, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`icon ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const Layout = ({ children }) => {
  const { width } = useWindowSize(); // Use our custom hook
  const isMobile = width < 768;

  // State for desktop sidebar pinning
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  // State for desktop sidebar hover
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  // State specifically for the mobile menu overlay
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine if the sidebar should be visually expanded
  const isSidebarOpen = isMobile ? isMobileMenuOpen : (isSidebarPinned || isSidebarHovered);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const toggleDesktopPin = () => {
    setIsSidebarPinned(!isSidebarPinned);
  };

  return (
    <div className="app-layout">
      {/* Mobile-only menu button, now correctly rendered */}
      {isMobile && (
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </button>
      )}

      {/* Backdrop for mobile overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="sidebar-backdrop" onClick={toggleMobileMenu}></div>
      )}

      <div
        className="sidebar-wrapper"
        onMouseEnter={() => !isMobile && setIsSidebarHovered(true)}
        onMouseLeave={() => !isMobile && setIsSidebarHovered(false)}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          isPinned={isSidebarPinned}
          togglePin={toggleDesktopPin}
          onNavItemClick={isMobile ? toggleMobileMenu : undefined} // Close menu on mobile after click
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
