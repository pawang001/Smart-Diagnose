import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Icon = ({ path, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`icon ${className}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const NavItem = ({ to, iconPath, label, isActive, onClick, isExpanded }) => (
  <li className={`nav-item ${isActive ? "active" : ""}`}>
    <Link
      to={to}
      className="nav-link"
      onClick={onClick}
      title={isExpanded ? "" : label}
    >
      <Icon path={iconPath} className="nav-icon" />
      <span className="nav-text">{label}</span>
    </Link>
  </li>
);

const Sidebar = ({ isOpen, isPinned, togglePin, onNavItemClick }) => {
  const location = useLocation();

  const mainNavItems = [
    {
      to: "/predict/breast-cancer",
      iconPath:
        "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
      label: "Breast Cancer",
    },
    {
      to: "/predict/heart-disease",
      iconPath:
        "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
      label: "Heart Disease",
    },
    {
      to: "/predict/diabetes",
      iconPath:
        "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-1.44m4.662-2.946a8.25 8.25 0 00-4.662-2.946m4.662 2.946l-2.344 2.343m-2.322-4.685a8.25 8.25 0 00-4.662 2.946m0 0l-2.343 2.343m0 0a8.25 8.25 0 014.662-2.946",
      label: "Diabetes",
    },
    {
      to: "/history",
      iconPath: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
      label: "History",
    },
  ];

  const homeNavItem = {
    to: "/",
    iconPath:
      "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5",
    label: "Back to Home",
  };

  return (
    <aside className={`sidebar${isOpen ? " open" : ""}`}>
      <div className="sidebar-header">
        <button
          onClick={togglePin}
          className="pin-toggle"
          title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
        >
          <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </button>
        <div className="sidebar-logo">
          <span className="sidebar-logo-text">Smart Diagnose</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul className="nav-links-main">
          {mainNavItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              iconPath={item.iconPath}
              label={item.label}
              isActive={location.pathname === item.to}
              onClick={onNavItemClick}
              isExpanded={isOpen}
            />
          ))}
        </ul>
        <ul className="nav-links-bottom">
          <NavItem
            key={homeNavItem.to}
            to={homeNavItem.to}
            iconPath={homeNavItem.iconPath}
            label={homeNavItem.label}
            isActive={location.pathname === homeNavItem.to}
            onClick={onNavItemClick}
            isExpanded={isOpen}
          />
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
