import React from 'react';

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="navbar">
      <button className="hamburger" onClick={toggleSidebar}>☰</button>
      <h1 className="app-title">MediPredict</h1>
    </header>
  );
};

export default Navbar;
