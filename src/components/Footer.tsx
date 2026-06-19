export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#2D5016', color: '#FAF7F2' }} className="mt-16">
      <style>{`
        .footer-link {
          position: relative;
          display: inline-block;
          text-decoration: none;
          color: inherit;
          transition: opacity 0.2s ease;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background-color: #A8D5A2;
          transition: width 0.25s ease;
        }
        .footer-link:hover::after {
          width: 100%;
        }
        .footer-link:hover {
          opacity: 1;
        }
        .newsletter-input {
          flex: 1;
          padding: 8px 12px;
          border-radius: 4px 0 0 4px;
          font-size: 14px;
          color: #1a1a1a;
          background-color: #FAF7F2;
          border: 1.5px solid transparent;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          min-width: 0;
        }
        .newsletter-input:focus {
          border-color: #A8D5A2;
          box-shadow: 0 0 0 3px rgba(168, 213, 162, 0.25);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍃</span>
              <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold">
                Leaf &amp; Lore
              </span>
            </div>
            <p className="text-sm opacity-80 max-w-xs leading-relaxed">
              A curated haven for book lovers. We celebrate stories across languages, cultures, and genres — from English classics to Hindi poetry, Marathi literature to Japanese manga.
            </p>
            <div className="flex gap-4 mt-4 text-lg">
              <span className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-200">📸</span>
              <span className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-200">🐦</span>
              <span className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-200">📘</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif" }} className="font-semibold mb-3 text-base">
              Explore
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              {['Home', 'Shop All Books', 'New Arrivals', 'Bestsellers', 'Gift Cards'].map(l => (
                <li key={l}>
                  <a href="#" className="footer-link">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif" }} className="font-semibold mb-3 text-base">
              Newsletter
            </h4>
            <p className="text-sm opacity-80 mb-3 leading-relaxed">
              Get book recommendations, author updates &amp; exclusive offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                className="newsletter-input"
              />
              <button
                className="px-3 py-2 text-sm font-medium transition-opacity duration-200 hover:opacity-90"
                style={{ backgroundColor: '#8B4513', color: 'white', borderRadius: '0 4px 4px 0', border: 'none', cursor: 'pointer' }}
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-4 text-center text-xs opacity-60">
          © 2024 Leaf &amp; Lore. Made with 🍃 and love for books.
        </div>
      </div>
    </footer>
  );
}
