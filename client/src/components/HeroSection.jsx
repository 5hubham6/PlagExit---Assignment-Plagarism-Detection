import React from "react";
import "./HeroSection.css";
import GridDotBackground from "./GridDotBackground";
import BackgroundLines from "./BackgroundLines";

export default function HeroSection() {
  return (
    <section className="aceternity-hero-section">
      <GridDotBackground />
      <BackgroundLines />
      <div className="aceternity-hero-container">
        {/* Left: Text */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1 className="aceternity-hero-title animate-fade-in">
            Automated Assignment Checking & Plagiarism Detection
          </h1>
          <p className="aceternity-hero-desc animate-fade-in delay-100">
            Instantly grade assignments, check for plagiarism, and provide detailed feedback—all in one platform. Save time for educators and ensure academic integrity for students with our AI-powered automated assignment checker.
          </p>
          <div className="aceternity-hero-actions animate-fade-in delay-200">
            <a
              href="/register"
              className="aceternity-hero-btn aceternity-hero-btn-primary"
            >
              Get Started
            </a>
            <a
              href="/contact"
              className="aceternity-hero-btn aceternity-hero-btn-secondary"
            >
              Learn More
            </a>
          </div>
        </div>
        {/* Right: Image */}
        <div style={{ flex: 1, minWidth: 220, display: "flex", justifyContent: "center" }}>
          <img
            src="/architecture.png"
            alt="Automated Assignment Checking and Plagiarism Detection Illustration"
            className="aceternity-hero-image"
          />
        </div>
      </div>
    </section>
  );
} 