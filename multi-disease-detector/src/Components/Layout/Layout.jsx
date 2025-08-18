import React, { useState } from 'react';
import { UseWindowSize } from './UseWindowSize';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

// A reusable Icon component
const Icon = ({ path, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" className={`icon ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const Layout = ({ children }) => {
  const { width } = UseWindowSize();
  const isMobile = width < 768;

  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine if the sidebar should be visually expanded
  const isSidebarOpen = isMobile ? isMobileMenuOpen : (isSidebarPinned || isSidebarHovered);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);
  const toggleDesktopPin = () => setIsSidebarPinned((v) => !v);

  return (
    <div className="app-layout">
      {isMobile && !isMobileMenuOpen && (
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Open sidebar">
          <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </button>
      )}

      {/* The dark backdrop for the mobile menu */}
      {isMobile && isSidebarOpen && (
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
          togglePin={toggleDesktopPin} // The pin button only controls pinning now
          onNavItemClick={isMobile ? toggleMobileMenu : undefined} // On mobile, clicking a nav item closes the menu
        />
      </div>

      <main className={`page-content${!isMobile && isSidebarPinned ? ' pinned' : ''}`}>
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;