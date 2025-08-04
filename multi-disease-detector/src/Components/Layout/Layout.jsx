import React, { useState } from 'react';
import { UseWindowSize } from '../Layout/UseWindowSize'; // Corrected casing
import Sidebar from './../Sidebar/Sidebar';
import './Layout.css';

// A reusable Icon component
const Icon = ({ path, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`icon ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const Layout = ({ children, diseases, activeDisease, onDiseaseSelect }) => {
  const { width } = UseWindowSize();
  const isMobile = width < 768;

  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
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
      {/* This button is ONLY visible on mobile and controls the overlay menu */}
      {isMobile && (
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </button>
      )}

      {/* The dark backdrop for the mobile menu */}
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
          // On mobile, the pin button doesn't exist, so we pass the mobile toggle function.
          // On desktop, we pass the pin function. This is a placeholder for the pin button inside the sidebar.
          togglePin={isMobile ? toggleMobileMenu : toggleDesktopPin}
          // This function closes the mobile menu when a nav item is clicked
          onNavItemClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
          diseases={diseases}
          activeDisease={activeDisease}
          onDiseaseSelect={onDiseaseSelect}
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
