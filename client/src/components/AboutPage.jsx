import React from 'react';
import ResizableNavbar from './ResizableNavbar';
import { FaUsers, FaLightbulb, FaRocket, FaHeart } from 'react-icons/fa';

const VALUES = [
  {
    icon: <FaLightbulb size={28} color="#27ae60" />,
    title: 'Innovation',
    desc: 'We use the latest AI and technology to make assignment checking and plagiarism detection smarter and faster.'
  },
  {
    icon: <FaHeart size={28} color="#e53935" />,
    title: 'Integrity',
    desc: 'We believe in fairness, transparency, and academic honesty for all.'
  },
  {
    icon: <FaUsers size={28} color="#1976D2" />,
    title: 'Community',
    desc: 'We build for educators and students, listening to your needs and feedback.'
  },
  {
    icon: <FaRocket size={28} color="#ff9800" />,
    title: 'Empowerment',
    desc: 'Our tools help you focus on learning and teaching, not paperwork.'
  }
];

export default function AboutPage() {
  return (
    <div style={{ fontFamily: 'Cal Sans, Arial, sans-serif', minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #fffde7 100%)' }}>
      <ResizableNavbar />
      <main style={{ maxWidth: 900, margin: '64px auto', padding: 24 }}>
        <h1 style={{ fontSize: '2.3rem', fontWeight: 800, marginBottom: 10, color: '#1976D2', letterSpacing: '-1px' }}>About Us</h1>
        <p style={{ fontSize: '1.18rem', color: '#444', marginBottom: 32, maxWidth: 700 }}>
          <strong>AutoAssign Checker</strong> is dedicated to making academic integrity effortless and accessible. Our mission is to empower educators and students with fast, fair, and transparent assignment checking and plagiarism detection—all in a delightful, modern interface.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '28px', margin: '32px 0' }}>
          {VALUES.map((value, idx) => (
            <div key={idx} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(34,34,34,0.06)', padding: '28px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1.5px solid #f0e9e0' }}>
              <div style={{ marginBottom: 12 }}>{value.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '1.08rem', color: '#1976D2', marginBottom: 6 }}>{value.title}</div>
              <div style={{ color: '#444', fontSize: '1rem', lineHeight: 1.5 }}>{value.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40, color: '#888', fontSize: '1.08rem', textAlign: 'center', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
          <strong>Our Vision:</strong> To create a world where grading is instant, feedback is meaningful, and academic honesty is the norm.<br />
          <span style={{ color: '#1976D2', fontWeight: 700 }}>Thank you for being part of our journey!</span>
        </div>
      </main>
    </div>
  );
} 