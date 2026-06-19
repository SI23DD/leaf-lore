export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#2D5016', color: '#FAF7F2' }} className="mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍃</span>
              <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold">
                Leaf & Lore
              </span>
            </div>
            <p className="text-sm opacity-80 max-w-xs leading-relaxed">
              A curated haven for book lovers. We celebrate stories across languages, cultures, and genres — from English classics to Hindi poetry, Marathi literature to Japanese manga.
            </p>
            <div className="flex gap-4 mt-4 text-lg">
              <span className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity">📸</span>
              <span className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity">🐦</span>
              <span className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity">📘</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif" }} className="font-semibold mb-3 text-base">
              Explore
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              {['Home', 'Shop All Books', 'New Arrivals', 'Bestsellers', 'Gift Cards'].map(l => (
                <li key={l}>
                  <a href="#" className="hover:opacity-100 transition-opacity">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif" }} className="font-semibold mb-3 text-base">
              Newsletter
            </h4>
            <p className="text-sm opacity-80 mb-3 leading-relaxed">
              Get book recommendations, author updates & exclusive offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 rounded text-sm text-gray-800 outline-none min-w-0"
                style={{ backgroundColor: '#FAF7F2' }}
              />
              <button
                className="px-3 py-2 rounded text-sm font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#8B4513', color: 'white' }}
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-4 text-center text-xs opacity-60">
          © 2024 Leaf & Lore. Made with 🍃 and love for books.
        </div>
      </div>
    </footer>
  );
}
