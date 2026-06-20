'use client';
import { useState, useRef } from 'react';

const SUBJECTS = [
  'General inquiry',
  'Order issue',
  'Book request',
  'Feedback',
];

const FAQS = [
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery across India takes 4–7 working days. For metro cities, we often ship within 2–3 days. You\'ll get a tracking link by SMS once your parcel leaves our shelves.',
  },
  {
    q: 'Do you accept returns?',
    a: 'Yes — if a book arrives damaged or isn\'t what you ordered, write to us within 7 days of delivery. We\'ll arrange a pickup and send a replacement or full refund, whichever you prefer.',
  },
  {
    q: 'Can I track my order?',
    a: 'Absolutely. Once dispatched, you\'ll receive an SMS with a tracking link from our courier partner. You can also email us your order number and we\'ll share the latest status right away.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Not yet — we currently ship only within India. International shipping is something we\'re actively exploring; sign up for our newsletter and we\'ll let you know the moment it\'s live.',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <style>{`
        :root {
          --green: #C82333;
          --brown: #666666;
          --cream: #ffffff;
          --surface: #F0EBE3;
          --green-light: #4A7A25;
          --green-muted: rgba(200,35,51,0.08);
        }

        /* ── Hero ── */
        .contact-hero {
          background: linear-gradient(135deg, #C82333 0%, #A71D2A 50%, #8B0000 100%);
          position: relative;
          overflow: hidden;
          padding: 80px 24px 96px;
          text-align: center;
        }

        /* Botanical pressed-leaf border effect — pure CSS, no SVG */
        .contact-hero::before {
          content: '';
          position: absolute;
          inset: 16px;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 2px;
          pointer-events: none;
        }
        .leaf-corner {
          position: absolute;
          width: 80px;
          height: 80px;
          pointer-events: none;
        }
        .leaf-corner::before,
        .leaf-corner::after {
          content: '';
          position: absolute;
          border-radius: 50% 0;
          background: rgba(255,255,255,0.07);
        }
        .leaf-corner.tl { top: 24px; left: 24px; }
        .leaf-corner.tl::before { width: 48px; height: 28px; top: 0; left: 0; transform: rotate(-20deg); }
        .leaf-corner.tl::after  { width: 32px; height: 18px; top: 12px; left: 8px; transform: rotate(15deg); }

        .leaf-corner.tr { top: 24px; right: 24px; transform: scaleX(-1); }
        .leaf-corner.tr::before { width: 48px; height: 28px; top: 0; left: 0; transform: rotate(-20deg); }
        .leaf-corner.tr::after  { width: 32px; height: 18px; top: 12px; left: 8px; transform: rotate(15deg); }

        .leaf-corner.bl { bottom: 24px; left: 24px; transform: scaleY(-1); }
        .leaf-corner.bl::before { width: 48px; height: 28px; top: 0; left: 0; transform: rotate(-20deg); }
        .leaf-corner.bl::after  { width: 32px; height: 18px; top: 12px; left: 8px; transform: rotate(15deg); }

        .leaf-corner.br { bottom: 24px; right: 24px; transform: scale(-1); }
        .leaf-corner.br::before { width: 48px; height: 28px; top: 0; left: 0; transform: rotate(-20deg); }
        .leaf-corner.br::after  { width: 32px; height: 18px; top: 12px; left: 8px; transform: rotate(15deg); }

        /* Floating decorative leaves in hero */
        .hero-leaf {
          position: absolute;
          font-size: 2rem;
          opacity: 0.18;
          animation: float-gentle 6s ease-in-out infinite;
          user-select: none;
        }
        .hero-leaf.l1 { top: 20%; left: 8%; animation-delay: 0s; font-size: 2.5rem; }
        .hero-leaf.l2 { top: 60%; left: 4%; animation-delay: 1.5s; font-size: 1.5rem; }
        .hero-leaf.l3 { top: 15%; right: 10%; animation-delay: 0.8s; font-size: 2rem; }
        .hero-leaf.l4 { top: 55%; right: 6%; animation-delay: 2s; font-size: 1.8rem; }
        .hero-leaf.l5 { bottom: 20%; left: 18%; animation-delay: 1s; font-size: 1.4rem; }
        .hero-leaf.l6 { bottom: 25%; right: 16%; animation-delay: 2.5s; font-size: 1.6rem; }

        .hero-eyebrow {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin-bottom: 16px;
          animation: fadeInUp 0.5s ease forwards;
        }
        .hero-title {
          font-family: var(--font-playfair, Georgia, serif);
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
          margin: 0 0 16px;
          animation: fadeInUp 0.6s 0.1s ease both;
        }
        .hero-subtitle {
          color: rgba(255,255,255,0.68);
          font-size: 1.05rem;
          max-width: 460px;
          margin: 0 auto;
          line-height: 1.7;
          animation: fadeInUp 0.6s 0.2s ease both;
        }

        /* ── Layout ── */
        .contact-body {
          max-width: 1180px;
          margin: 0 auto;
          padding: 64px 24px 80px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: start;
        }
        @media (max-width: 860px) {
          .contact-body { grid-template-columns: 1fr; gap: 40px; }
        }

        /* ── Form ── */
        .form-card {
          background: #fff;
          border-radius: 16px;
          padding: 40px 36px;
          box-shadow: 0 4px 24px rgba(200,35,51,0.08);
          animation: fadeInLeft 0.6s 0.1s ease both;
          position: relative;
        }
        .form-section-title {
          font-family: var(--font-playfair, Georgia, serif);
          font-size: 1.45rem;
          font-weight: 700;
          color: #C82333;
          margin: 0 0 8px;
        }
        .form-section-sub {
          font-size: 0.875rem;
          color: #888;
          margin: 0 0 28px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 560px) {
          .form-row { grid-template-columns: 1fr; }
          .form-card { padding: 28px 20px; }
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 18px;
        }
        .form-group.full { grid-column: 1 / -1; }
        .form-label {
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #555;
        }
        .form-input {
          padding: 11px 14px;
          border: 1.5px solid #E4DDD5;
          border-radius: 8px;
          font-size: 0.95rem;
          background: #FDFCFB;
          color: #1a1a1a;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          outline: none;
          font-family: inherit;
        }
        .form-input:focus {
          border-color: #C82333;
          box-shadow: 0 0 0 3px rgba(200,35,51,0.12);
        }
        textarea.form-input { resize: vertical; min-height: 120px; }
        select.form-input { cursor: pointer; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C82333' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }
        .submit-btn {
          width: 100%;
          padding: 14px;
          background: #C82333;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
          margin-top: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
        }
        .submit-btn:hover:not(:disabled) { background: #A71D2A; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Spinner */
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin-slow 0.7s linear infinite;
        }

        /* Success state */
        .success-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          min-height: 280px;
          gap: 16px;
          animation: fadeIn 0.5s ease forwards;
        }
        .success-check {
          width: 64px; height: 64px;
          background: #C82333;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          font-size: 1.8rem;
          animation: scaleIn 0.4s 0.1s ease both;
        }
        .success-title {
          font-family: var(--font-playfair, Georgia, serif);
          font-size: 1.6rem;
          font-weight: 700;
          color: #C82333;
        }
        .success-body { font-size: 0.925rem; color: #666; max-width: 280px; line-height: 1.65; }

        /* ── Info Cards ── */
        .info-col { animation: fadeInRight 0.6s 0.2s ease both; display: flex; flex-direction: column; gap: 16px; }
        .info-card {
          background: #fff;
          border-radius: 12px;
          padding: 20px 22px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          box-shadow: 0 2px 12px rgba(200,35,51,0.07);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .info-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,35,51,0.12); }
        .info-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(200,35,51,0.08);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }
        .info-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #aaa; margin-bottom: 2px; }
        .info-value { font-size: 0.95rem; color: #1a1a1a; font-weight: 500; }
        .info-sub { font-size: 0.82rem; color: #888; margin-top: 1px; }

        .map-card {
          background: linear-gradient(135deg, #C82333 0%, #A71D2A 100%);
          border-radius: 12px;
          padding: 28px 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 10px;
          min-height: 130px;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(200,35,51,0.18);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          text-decoration: none;
        }
        .map-card:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(200,35,51,0.28); }
        .map-grid-overlay {
          position: absolute;
          inset: 0;
          border-radius: 12px;
          background-image: repeating-linear-gradient(
            0deg, transparent, transparent 23px, rgba(255,255,255,0.04) 23px, rgba(255,255,255,0.04) 24px
          ), repeating-linear-gradient(
            90deg, transparent, transparent 23px, rgba(255,255,255,0.04) 23px, rgba(255,255,255,0.04) 24px
          );
        }
        .map-icon { font-size: 2rem; position: relative; z-index: 1; }
        .map-text { color: rgba(255,255,255,0.9); font-weight: 600; font-size: 0.95rem; position: relative; z-index: 1; }
        .map-sub { color: rgba(255,255,255,0.55); font-size: 0.8rem; position: relative; z-index: 1; }

        /* ── FAQ ── */
        .faq-section {
          max-width: 1180px;
          margin: 0 auto 80px;
          padding: 0 24px;
          animation: fadeInUp 0.6s 0.3s ease both;
        }
        .faq-heading {
          font-family: var(--font-playfair, Georgia, serif);
          font-size: 1.7rem;
          font-weight: 700;
          color: #C82333;
          margin: 0 0 8px;
        }
        .faq-subheading { font-size: 0.9rem; color: #888; margin: 0 0 28px; }
        .faq-list { display: flex; flex-direction: column; gap: 12px; }
        .faq-item {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(200,35,51,0.06);
          border: 1px solid #EEE8E0;
        }
        .faq-trigger {
          width: 100%;
          padding: 18px 22px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          font-size: 0.975rem;
          font-weight: 600;
          color: #1a1a1a;
          font-family: inherit;
          transition: background 0.15s ease;
        }
        .faq-trigger:hover { background: rgba(200,35,51,0.03); }
        .faq-chevron {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: rgba(200,35,51,0.08);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem;
          color: #C82333;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }
        .faq-chevron.open { transform: rotate(180deg); }
        .faq-body {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s ease, padding 0.3s ease;
          padding: 0 22px;
          font-size: 0.9rem;
          color: #555;
          line-height: 1.75;
        }
        .faq-body.open { max-height: 200px; padding: 0 22px 18px; }

        /* animation keyframes — re-declare locally in case globals.css not applied */
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="contact-hero">
        <div className="leaf-corner tl" aria-hidden="true"></div>
        <div className="leaf-corner tr" aria-hidden="true"></div>
        <div className="leaf-corner bl" aria-hidden="true"></div>
        <div className="leaf-corner br" aria-hidden="true"></div>
        <div className="hero-leaf l1" aria-hidden="true">🌿</div>
        <div className="hero-leaf l2" aria-hidden="true">🍃</div>
        <div className="hero-leaf l3" aria-hidden="true">🌱</div>
        <div className="hero-leaf l4" aria-hidden="true">🌿</div>
        <div className="hero-leaf l5" aria-hidden="true">🍃</div>
        <div className="hero-leaf l6" aria-hidden="true">🌱</div>
        <p className="hero-eyebrow">Leaf &amp; Lore · Bookshop</p>
        <h1 className="hero-title">Get in Touch</h1>
        <p className="hero-subtitle">
          Every question has a person behind it. We read every message and reply within one working day.
        </p>
      </section>

      {/* ── Two-column body ── */}
      <div className="contact-body">
        {/* LEFT: Form */}
        <div className="form-card">
          {submitted ? (
            <div className="success-panel">
              <div className="success-check" aria-label="Success">✓</div>
              <p className="success-title">Thank you!</p>
              <p className="success-body">
                Your message is with us. We'll write back to <strong>{form.email || 'you'}</strong> within one working day.
              </p>
            </div>
          ) : (
            <>
              <p className="form-section-title">Send us a message</p>
              <p className="form-section-sub">Fields marked with * are required</p>
              <form ref={formRef} onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">Name *</label>
                    <input id="name" name="name" type="text" required className="form-input"
                      placeholder="Priya Sharma" value={form.name} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email *</label>
                    <input id="email" name="email" type="email" required className="form-input"
                      placeholder="priya@email.com" value={form.email} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="subject">Subject *</label>
                  <select id="subject" name="subject" required className="form-input"
                    value={form.subject} onChange={handleChange}>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="message">Message *</label>
                  <textarea id="message" name="message" required className="form-input"
                    placeholder="Tell us what's on your mind — we're all ears (and pages)."
                    value={form.message} onChange={handleChange} rows={5} />
                </div>
                <button type="submit" className="submit-btn" disabled={submitting || !form.name || !form.email || !form.message}>
                  {submitting ? <><div className="spinner" aria-hidden="true"></div> Sending…</> : 'Send Message'}
                </button>
              </form>
            </>
          )}
        </div>

        {/* RIGHT: Info cards */}
        <div className="info-col">
          <div className="info-card">
            <div className="info-icon" aria-hidden="true">📧</div>
            <div>
              <p className="info-label">Email</p>
              <p className="info-value">hello@leafandlore.in</p>
              <p className="info-sub">We reply within one working day</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon" aria-hidden="true">📱</div>
            <div>
              <p className="info-label">Phone</p>
              <p className="info-value">+91 98765 43210</p>
              <p className="info-sub">Available during store hours</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon" aria-hidden="true">🕐</div>
            <div>
              <p className="info-label">Store Hours</p>
              <p className="info-value">Mon – Sat, 10 am – 7 pm IST</p>
              <p className="info-sub">Closed Sundays &amp; public holidays</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon" aria-hidden="true">📦</div>
            <div>
              <p className="info-label">Shipping</p>
              <p className="info-value">All over India</p>
              <p className="info-sub">Free shipping on orders above ₹500</p>
            </div>
          </div>
          {/* Map card */}
          <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
            className="map-card" aria-label="Open in Google Maps" style={{ position: 'relative' }}>
            <div className="map-grid-overlay" aria-hidden="true"></div>
            <div className="map-icon" aria-hidden="true">🗺️</div>
            <p className="map-text">Find us on Google Maps</p>
            <p className="map-sub">Opens in a new tab</p>
          </a>
        </div>
      </div>

      {/* ── FAQ ── */}
      <section className="faq-section">
        <p className="faq-heading">Frequently asked questions</p>
        <p className="faq-subheading">Quick answers to things people often wonder about.</p>
        <ul className="faq-list" role="list">
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <li key={i} className="faq-item">
                <button
                  className="faq-trigger"
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaq(isOpen ? null : i)}>
                  {faq.q}
                  <span className={`faq-chevron${isOpen ? ' open' : ''}`} aria-hidden="true">▾</span>
                </button>
                <div className={`faq-body${isOpen ? ' open' : ''}`} role="region">
                  {faq.a}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
