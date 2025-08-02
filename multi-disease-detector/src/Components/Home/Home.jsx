import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// Custom Hook for scroll animations
const useFadeInSection = () => {
    const domRef = useRef();
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        });
        const { current } = domRef;
        if (current) observer.observe(current);
        return () => { if (current) observer.unobserve(current); };
    }, []);
    return domRef;
};

// Reusable Section component with animation
const AnimatedSection = ({ children, className = '', id = '' }) => {
    const domRef = useFadeInSection();
    return (
        <section ref={domRef} id={id} className={`page-section fade-in-section ${className}`}>
            {children}
        </section>
    );
};

// Reusable Icon component
const FeatureIcon = ({ path }) => (
    <div className="feature-icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="feature-icon">
            <path fillRule="evenodd" d={path} clipRule="evenodd" />
        </svg>
    </div>
);

const Home = () => {
    const navigate = useNavigate();
    const handleGetStarted = () => navigate('/predict');

    // Function to handle smooth scrolling
    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="home-page">
            <nav className="home-nav">
                <div className="nav-logo">Smart Diagnose</div>
                <div className="nav-links">
                    <a href="#features" onClick={(e) => handleNavClick(e, 'features')}>Features</a>
                    <a href="#preview" onClick={(e) => handleNavClick(e, 'preview')}>Preview</a>
                    <a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a>
                </div>
            </nav>

            <header className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Intelligent Health Insights</h1>
                    <p className="hero-subtitle">
                        Leveraging advanced machine learning for early-stage disease prediction. Get instant, data-driven insights to empower your health decisions.
                    </p>
                    <button onClick={handleGetStarted} className="hero-cta-button">
                        Get Started
                    </button>
                </div>
            </header>

            <main>
                <AnimatedSection id="features">
                    <div className="section-header">
                        <h2 className="section-title">Why Choose Smart Diagnose?</h2>
                        <p className="section-description">
                            Our platform is built on three core principles: speed, security, and simplicity.
                        </p>
                    </div>
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
                </AnimatedSection>

                <AnimatedSection id="preview" className="image-preview-section">
                    <div className="section-header">
                        <h2 className="section-title">See It in Action</h2>
                        <p className="section-description">
                            Explore our clean, intuitive dashboard. All the information you need, presented clearly.
                        </p>
                    </div>
                    <div className="image-container">
                        <img 
                            src="src\assets\preview.png" 
                            alt="Smart Diagnose App Preview" 
                            className="preview-image"
                        />
                    </div>
                </AnimatedSection>

                <AnimatedSection id="about">
                    <div className="about-content">
                        <h2 className="section-title">About The Project</h2>
                        <p>
                            Smart Diagnose is a demonstration of how modern web technologies and machine learning can be combined to create powerful, accessible health-tech tools. The application hosts multiple prediction models, each trained on a standard dataset for a specific condition.
                        </p>
                        <p>
                            <strong>Disclaimer:</strong> This tool is for educational and informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
                        </p>
                    </div>
                </AnimatedSection>
            </main>
        </div>
    );
};

export default Home;
