import React from 'react';
import ResizableNavbar from './ResizableNavbar';
import { FaBolt, FaLock, FaChartBar, FaUserGraduate, FaRobot, FaClipboardCheck, FaUser, FaSchool, FaUniversity } from 'react-icons/fa';

const FEATURES = [
  {
    icon: <FaBolt size={32} color="#27ae60" />,
    title: 'Instant Grading',
    desc: 'Assignments are graded automatically within seconds, saving time for educators and students.'
  },
  {
    icon: <FaClipboardCheck size={32} color="#1976D2" />,
    title: 'Automated Correctness Check',
    desc: 'Student answers are compared to model answers using advanced AI for fair, unbiased evaluation.'
  },
  {
    icon: <FaChartBar size={32} color="#ff9800" />,
    title: 'Detailed Analytics',
    desc: 'Get actionable insights and reports on student performance and assignment trends.'
  },
  {
    icon: <FaLock size={32} color="#222" />,
    title: 'Secure & Private',
    desc: 'All data is encrypted and never shared. Your privacy and academic integrity are our top priorities.'
  },
  {
    icon: <FaRobot size={32} color="#8e24aa" />,
    title: 'AI Plagiarism Detection',
    desc: 'Detects copied, paraphrased, and AI-generated content with state-of-the-art algorithms.'
  },
  {
    icon: <FaUserGraduate size={32} color="#1976D2" />,
    title: 'For Students & Professors',
    desc: 'Intuitive dashboards and workflows for both roles. No training required.'
  }
];

const PRICING = [
  {
    icon: <FaUser size={32} color="#27ae60" />,
    title: 'Solo',
    price: 'Free',
    desc: 'Perfect for individual educators, tutors, or students. All features, no cost.'
  },
  {
    icon: <FaSchool size={32} color="#1976D2" />,
    title: 'School',
    price: '₹1999/mo',
    desc: 'Affordable plan for schools. Unlimited assignments, analytics, and priority support.'
  },
  {
    icon: <FaUniversity size={32} color="#8e24aa" />,
    title: 'University',
    price: '₹4999/mo',
    desc: 'For colleges and universities. Scalable, with advanced admin controls and integrations.'
  }
];

export default function FeaturesPage() {
  return (
    <div style={{ fontFamily: 'Cal Sans, Arial, sans-serif', minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #fffde7 100%)' }}>
      <ResizableNavbar />
      <main style={{ maxWidth: 1100, margin: '64px auto', padding: 24 }}>
        <h1 style={{ fontSize: '2.3rem', fontWeight: 800, marginBottom: 10, color: '#1976D2', letterSpacing: '-1px' }}>What Makes Us Unique?</h1>
        <p style={{ fontSize: '1.18rem', color: '#444', marginBottom: 40, maxWidth: 700 }}>
          Our platform combines automated assignment grading, advanced plagiarism detection, and beautiful analytics in a single, easy-to-use solution. Here's what you get:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '32px', marginTop: 24 }}>
          {FEATURES.map((feature, idx) => (
            <div key={idx} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(34,34,34,0.06)', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'box-shadow 0.2s', border: '1.5px solid #f0e9e0' }}>
              <div style={{ marginBottom: 18 }}>{feature.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '1.18rem', color: '#1976D2', marginBottom: 8 }}>{feature.title}</div>
              <div style={{ color: '#444', fontSize: '1.05rem', lineHeight: 1.5 }}>{feature.desc}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export function PricingPage() {
  return (
    <div style={{ fontFamily: 'Cal Sans, Arial, sans-serif', minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #fffde7 100%)' }}>
      <ResizableNavbar />
      <main style={{ maxWidth: 900, margin: '64px auto', padding: 24 }}>
        <h1 style={{ fontSize: '2.3rem', fontWeight: 800, marginBottom: 10, color: '#1976D2', letterSpacing: '-1px' }}>Simple, Transparent Pricing</h1>
        <p style={{ fontSize: '1.18rem', color: '#444', marginBottom: 40, maxWidth: 700 }}>
          Whether you're an individual, a school, or a university, we have a plan for you. No hidden fees. Cancel anytime.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px', marginTop: 24 }}>
          {PRICING.map((plan, idx) => (
            <div key={idx} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(34,34,34,0.06)', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'box-shadow 0.2s', border: '1.5px solid #f0e9e0' }}>
              <div style={{ marginBottom: 18 }}>{plan.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '1.18rem', color: '#1976D2', marginBottom: 8 }}>{plan.title}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#27ae60', marginBottom: 8 }}>{plan.price}</div>
              <div style={{ color: '#444', fontSize: '1.05rem', lineHeight: 1.5, marginBottom: 8 }}>{plan.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40, color: '#888', fontSize: '1.05rem', textAlign: 'center' }}>
          <strong>Educational discounts</strong> available for government and non-profit institutions. <br />Contact us for a custom quote or to discuss your needs.
        </div>
      </main>
    </div>
  );
} 