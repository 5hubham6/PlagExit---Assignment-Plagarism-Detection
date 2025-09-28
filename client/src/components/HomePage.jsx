import React from 'react';
import ResizableNavbar from './ResizableNavbar';
import HeroSection from './HeroSection';
import TrustedByMarquee from './TrustedByMarquee';
import StickyScrollRevealDemo from './sticky-scroll-reveal-demo';
// import { motion } from "framer-motion"; // No longer needed

const FEATURES = [
  { icon: '⚡', title: 'Instant Plagiarism Check', desc: 'Get results in seconds with our high-performance AI engine.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'Your assignments and data are encrypted and never shared.' },
  { icon: '📊', title: 'Detailed Reports', desc: 'Easy-to-read, actionable plagiarism reports for every submission.' },
  { icon: '👩‍🏫', title: 'For Students & Professors', desc: 'Simple dashboards for both roles. No training required.' }
];

export default function HomePage() {
  return (
    <>
      <ResizableNavbar />
      {/* <div className="framer-bg-orb-green"></div> */}
      {/* <svg className="framer-bg-arc-green" ...>...</svg> */}
      {/* <svg className="framer-bg-grid-green" ...>...</svg> */}
      <div style={{ position: "relative", minHeight: '100vh', fontFamily: 'Inter, Cal Sans, Arial, sans-serif', display: 'flex', flexDirection: 'column', zIndex: 1, paddingTop: 88 }}>
        {/* News Banner */}
        <div style={{ width: '100%', background: '#F6F6F6', color: '#222', fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center', padding: '8px 0', borderBottom: '1px solid #eee', marginTop: -16 ,paddingTop: 36}}>
          🚀 New: Automated assignment checking & plagiarism detection now live!
        </div>
        <HeroSection />
        <TrustedByMarquee />
        {/* Features Section - replaced with StickyScrollRevealDemo */}
        <div style={{ margin: '48px 0' }}>
          <StickyScrollRevealDemo />
        </div>
        {/* Minimal Footer */}
        <footer style={{ marginTop: 'auto', background: '#fff', borderTop: '1.5px solid #eee', padding: '24px 0 12px 0', textAlign: 'center', fontSize: '1rem', color: '#888', fontFamily: 'Inter, Cal Sans, Arial, sans-serif' }}>
          <div style={{ marginBottom: 6 }}>
            &copy; {new Date().getFullYear()} AutoAssign Checker
          </div>
          <div>
            <a href="/contact" style={{ color: '#1976D2', textDecoration: 'underline', margin: '0 12px' }}>Contact</a>
            <a href="/how-it-works" style={{ color: '#1976D2', textDecoration: 'underline', margin: '0 12px' }}>How It Works</a>
          </div>
        </footer>
      </div>
    </>
  );
} 