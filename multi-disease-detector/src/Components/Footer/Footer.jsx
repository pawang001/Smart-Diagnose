import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <p>
        &copy; {new Date().getFullYear()} Smart Diagnose. All Rights Reserved.
      </p>
      <p>
        Created by <a href="https://github.com/pawang001" target="_blank" rel="noopener noreferrer">&lt;Pawan /&gt;</a>
      </p>
    </footer>
  );
};

export default Footer;