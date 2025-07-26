import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// A reusable Icon component for the features section
const FeatureIcon = ({ path }) => (
  <div className="feature-icon-wrapper">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="feature-icon">
      <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
  </div>
);

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/predict');
  };

  return (
    <div className="home-page">
      <header className="hero-section">
        <div className="hero-background-grid"></div>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Smart Diagnose</h1>
          <p className="hero-subtitle">
            Leveraging Machine Learning for early-stage disease prediction.
            Get instant insights based on key medical data points.
          </p>
          <button onClick={handleGetStarted} className="hero-cta-button">
            Get Started
          </button>
        </div>
      </header>

      <main>
        <section id="features" className="features-section">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FeatureIcon path="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              <h3>Instant Predictions</h3>
              <p>Our fine-tuned machine learning models provide results in seconds, not hours.</p>
            </div>
            <div className="feature-card">
              <FeatureIcon path="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              <h3>Data Privacy</h3>
              <p>Your data is processed securely and is never stored permanently on our servers.</p>
            </div>
            <div className="feature-card">
              <FeatureIcon path="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM21 21l-5.197-5.197" />
              <h3>Multi-Disease Support</h3>
              <p>Easily switch between different prediction models for various diseases.</p>
            </div>
          </div>
        </section>

        <section id="about" className="about-section">
          <div className="about-content">
            <h2 className="section-title">About The Project</h2>
            <p>
              Smart Diagnose is a demonstration of how modern web technologies and machine learning can be combined to create powerful, accessible health-tech tools. The application hosts multiple prediction models, each trained on a standard dataset for a specific condition. Our platform uses classification algorithms to determine a result based on the features you provide.
            </p>
            <p>
              <strong>Disclaimer:</strong> This tool is for educational and informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
