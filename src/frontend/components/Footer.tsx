export default function Footer() {
  const quickLinks = [
    ['#', 'About Us'],
    ['/contact', 'Contact Us'],
    ['#', 'Return & Replacement'],
    ['#', 'Privacy Policy'],
    ['#', 'Terms & Conditions'],
    ['#', 'Bulk Purchase'],
  ];

  return (
    <footer>
      <style>{`
        .ll-footer {
          background: #1a1a1a;
          color: #fff;
          margin-top: 64px;
        }
        .ll-footer a {
          color: #ccc;
          text-decoration: none;
          font-size: 13.5px;
          line-height: 2;
          transition: color 0.18s;
          display: inline-block;
        }
        .ll-footer a:hover { color: #C82333; }
        .ll-footer-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px 36px;
          display: grid;
          grid-template-columns: 2fr 1.2fr 2fr;
          gap: 40px;
        }
        .ll-footer-col-title {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 18px;
        }
        .ll-footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
        }
        .ll-social-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #ccc;
          text-decoration: none;
          margin-right: 16px;
          transition: color 0.18s;
        }
        .ll-social-btn:hover { color: #C82333; }
        .ll-footer-bottom {
          background: #111;
          border-top: 1px solid #2a2a2a;
        }
        .ll-footer-bottom-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .ll-footer-copy {
          font-size: 12px;
          color: #888;
        }
        .ll-payment-badge {
          display: inline-block;
          background: #2a2a2a;
          color: #aaa;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 3px;
          letter-spacing: 0.5px;
          margin-left: 6px;
        }
        @media (max-width: 768px) {
          .ll-footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .ll-footer-bottom-inner {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>

      <div className="ll-footer">
        <div className="ll-footer-grid">

          {/* Column 1: Brand */}
          <div>
            <div className="ll-footer-logo">
              <span>🍃</span>
              <span>Leaf &amp; Lore</span>
            </div>
            <p style={{ fontSize: 13.5, color: '#aaa', lineHeight: 1.7, marginBottom: 20, maxWidth: 280 }}>
              Your ultimate destination for books. We are passionate book lovers dedicated to connecting readers across English, Hindi, Marathi, Japanese and Manga titles.
            </p>
            <div>
              <a href="#" className="ll-social-btn" aria-label="Facebook">
                <span style={{ fontSize: 16 }}>📘</span> Facebook
              </a>
              <a href="#" className="ll-social-btn" aria-label="Instagram">
                <span style={{ fontSize: 16 }}>📷</span> Instagram
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <div className="ll-footer-col-title">Quick Links</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {quickLinks.map(([href, label]) => (
                <li key={label}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: About */}
          <div>
            <div className="ll-footer-col-title">About the Shop</div>
            <p style={{ fontSize: 13.5, color: '#aaa', lineHeight: 1.7 }}>
              Welcome to Leaf &amp; Lore, your ultimate destination for books! We are passionate book lovers dedicated to connecting readers across English, Hindi, Marathi, Japanese and Manga titles.
            </p>
            <p style={{ fontSize: 13.5, color: '#aaa', lineHeight: 1.7, marginTop: 12 }}>
              Every order ships with a free bookmark. Every purchase supports independent reading culture.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="ll-footer-bottom">
          <div className="ll-footer-bottom-inner">
            <span className="ll-footer-copy">
              &copy; 2024 Leaf &amp; Lore. All rights reserved.
            </span>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ fontSize: 12, color: '#666', marginRight: 6 }}>We accept:</span>
              <span className="ll-payment-badge">VISA</span>
              <span className="ll-payment-badge">MASTERCARD</span>
              <span className="ll-payment-badge">UPI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
