import React, { useState } from 'react';
import ResizableNavbar from './ResizableNavbar';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the form data to your backend or email service
    setSubmitted(true);
  };

  return (
    <div style={{ fontFamily: 'Cal Sans, Arial, sans-serif', minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #fffde7 100%)' }}>
      <ResizableNavbar />
      <main style={{ maxWidth: 800, margin: '64px auto', padding: 24 }}>
        <h1 style={{ fontSize: '2.3rem', fontWeight: 800, marginBottom: 10, color: '#1976D2', letterSpacing: '-1px' }}>Contact Us</h1>
        <p style={{ fontSize: '1.18rem', color: '#444', marginBottom: 32, maxWidth: 600 }}>
          Have questions, feedback, or need support? Reach out and we'll be happy to help you on your journey to academic integrity.
        </p>
        <div style={{ background: 'linear-gradient(120deg, #fff 60%, #e3f2fd 100%)', borderRadius: 22, boxShadow: '0 6px 32px rgba(25, 118, 210, 0.10)', padding: '44px 36px', maxWidth: 540, margin: '0 auto', border: '1.5px solid #e3eafc', position: 'relative' }}>
          <div style={{ fontWeight: 800, fontSize: '1.35rem', color: '#1976D2', marginBottom: 8, letterSpacing: '-0.5px', textAlign: 'center' }}>Send us a message</div>
          <div style={{ height: 2, background: 'linear-gradient(90deg, #1976D2 0%, #27ae60 100%)', borderRadius: 2, margin: '0 auto 28px auto', width: 60 }} />
          {submitted ? (
            <div style={{ color: '#27ae60', fontWeight: 700, fontSize: '1.15rem', textAlign: 'center', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Thank you for reaching out! We'll get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <label style={{ fontWeight: 700, color: '#1976D2', marginBottom: 4, fontSize: '1.08rem', letterSpacing: 0.2 }}>Name</label>
              <input name="name" type="text" value={form.name} onChange={handleChange} required style={{ padding: '14px 18px', borderRadius: 10, border: '2px solid #e0e0e0', fontSize: '1.08rem', marginBottom: 8, fontWeight: 600, background: '#f8fafc', outline: 'none', boxShadow: '0 1px 4px rgba(25,118,210,0.04)' }} />
              <label style={{ fontWeight: 700, color: '#1976D2', marginBottom: 4, fontSize: '1.08rem', letterSpacing: 0.2 }}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ padding: '14px 18px', borderRadius: 10, border: '2px solid #e0e0e0', fontSize: '1.08rem', marginBottom: 8, fontWeight: 600, background: '#f8fafc', outline: 'none', boxShadow: '0 1px 4px rgba(25,118,210,0.04)' }} />
              <label style={{ fontWeight: 700, color: '#1976D2', marginBottom: 4, fontSize: '1.08rem', letterSpacing: 0.2 }}>Subject</label>
              <input name="subject" type="text" value={form.subject} onChange={handleChange} required style={{ padding: '14px 18px', borderRadius: 10, border: '2px solid #e0e0e0', fontSize: '1.08rem', marginBottom: 8, fontWeight: 600, background: '#f8fafc', outline: 'none', boxShadow: '0 1px 4px rgba(25,118,210,0.04)' }} />
              <label style={{ fontWeight: 700, color: '#1976D2', marginBottom: 4, fontSize: '1.08rem', letterSpacing: 0.2 }}>Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} required rows={5} style={{ padding: '14px 18px', borderRadius: 10, border: '2px solid #e0e0e0', fontSize: '1.08rem', marginBottom: 8, fontWeight: 600, background: '#f8fafc', outline: 'none', boxShadow: '0 1px 4px rgba(25,118,210,0.04)', resize: 'vertical' }} />
              <button type="submit" style={{ background: 'linear-gradient(90deg, #1976D2 0%, #27ae60 100%)', color: '#fff', fontWeight: 800, fontSize: '1.13rem', border: 'none', borderRadius: 10, padding: '15px 0', marginTop: 8, cursor: 'pointer', boxShadow: '0 2px 8px rgba(25,118,210,0.10)', letterSpacing: 0.5, transition: 'background 0.18s' }}>
                Send Message
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
} 