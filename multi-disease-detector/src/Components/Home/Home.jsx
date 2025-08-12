import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

// --- FIX: Import the images directly ---
import predictionPreview from "../../assets/prediction.png";
import resultPreview from "../../assets/result.png";
import historyPreview from "../../assets/history.png";

// --- Reusable Components & Hooks ---

// Custom Hook for fade-in scroll animations
const useFadeInSection = () => {
  const domRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    });
    const { current } = domRef;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);
  return domRef;
};

// Animated Section Wrapper
const AnimatedSection = ({ children, className = "", id = "" }) => {
  const domRef = useFadeInSection();
  return (
    <section
      ref={domRef}
      id={id}
      className={`page-section fade-in-section ${className}`}
    >
      {children}
    </section>
  );
};

// Feature Card Icon
const FeatureIcon = ({ path }) => (
  <div className="feature-icon-wrapper">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="feature-icon"
    >
      <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
  </div>
);

// FAQ Item with accordion logic
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <span className={`faq-icon ${isOpen ? "open" : ""}`}>+</span>
      </button>
      <div className={`faq-answer ${isOpen ? "open" : ""}`}>
        <p>{answer}</p>
      </div>
    </div>
  );
};

// --- Main Home Component ---

const Home = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate("/predict/breast-cancer");

  const [activePreview, setActivePreview] = useState("form");

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // --- FIX: Use the imported image variables ---
  const previewData = {
    form: {
      title: "Intuitive Data Entry",
      image: predictionPreview,
    },
    result: {
      title: "Clear & Detailed Results",
      image: resultPreview,
    },
    history: {
      title: "Track Your History",
      image: historyPreview,
    },
  };

  return (
    <div className="home-page">
      <nav className="home-nav">
        <div className="nav-logo">Smart Diagnose</div>
        <div className="nav-links">
          <a href="#features" onClick={(e) => handleNavClick(e, "features")}>
            Features
          </a>
          <a href="#preview" onClick={(e) => handleNavClick(e, "preview")}>
            Preview
          </a>
          <a href="#faq" onClick={(e) => handleNavClick(e, "faq")}>
            FAQ
          </a>
        </div>
      </nav>

      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Intelligent Health Insights</h1>
          <p className="hero-subtitle">
            Leveraging advanced machine learning for early-stage disease
            prediction. Get instant, data-driven insights to empower your health
            decisions.
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
              Our platform is built on three core principles: speed, security,
              and simplicity.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <FeatureIcon path="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              <h3>Instant Predictions</h3>
              <p>
                Our fine-tuned machine learning models provide results in
                seconds, not hours.
              </p>
            </div>
            <div className="feature-card">
              <FeatureIcon path="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              <h3>Data Privacy</h3>
              <p>
                Your data is processed securely and is never stored permanently
                on our servers.
              </p>
            </div>
            <div className="feature-card">
              <FeatureIcon path="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM21 21l-5.197-5.197" />
              <h3>Multi-Disease Support</h3>
              <p>
                Easily switch between different prediction models for various
                diseases.
              </p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="preview" className="preview-section">
          <div className="section-header">
            <h2 className="section-title">See It in Action</h2>
            <p className="section-description">
              Explore our clean, intuitive dashboard. All the information you
              need, presented clearly.
            </p>
          </div>
          <div className="preview-tabs">
            <button
              className={`tab-button ${
                activePreview === "form" ? "active" : ""
              }`}
              onClick={() => setActivePreview("form")}
            >
              Input Form
            </button>
            <button
              className={`tab-button ${
                activePreview === "result" ? "active" : ""
              }`}
              onClick={() => setActivePreview("result")}
            >
              Detailed Result
            </button>
            <button
              className={`tab-button ${
                activePreview === "history" ? "active" : ""
              }`}
              onClick={() => setActivePreview("history")}
            >
              Track History
            </button>
          </div>
          <div className="preview-content">
            {Object.keys(previewData).map((key) => (
              <img
                key={key}
                src={previewData[key].image}
                alt={`${previewData[key].title} Preview`}
                className={`preview-image ${
                  activePreview === key ? "active" : ""
                }`}
              />
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection id="faq">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="faq-accordion">
            <FaqItem
              question="How accurate are the predictions?"
              answer="The models are trained on standard, publicly available datasets and achieve high accuracy on validation data. However, they are for informational purposes only and do not replace a professional medical diagnosis."
            />
            <FaqItem
              question="Is my data safe?"
              answer="Absolutely. We prioritize your privacy. The data you enter is processed for prediction and is never stored on our servers. All prediction history is saved locally in your own browser, giving you full control."
            />
            <FaqItem
              question="What should I do with the prediction result?"
              answer="A prediction from Smart Diagnose is not a medical diagnosis. You should always consult with a qualified healthcare professional to interpret the results and discuss appropriate next steps for your health."
            />
            <FaqItem
              question="Which diseases can this tool predict?"
              answer="Currently, the platform supports models for Breast Cancer, Heart Disease, Diabetes, and Kidney Disease. We are continuously working to validate and add new models for other conditions."
            />
          </div>
        </AnimatedSection>
      </main>
    </div>
  );
};

export default Home;
