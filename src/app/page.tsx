'use client';
import Link from 'next/link';
import { books } from '@/data/books';
import BookCard from '@/components/BookCard';

const testimonials = [
  {
    name: 'Priya Sharma',
    rating: 5,
    text: 'Found the most beautiful Marathi novels here. The curation is exceptional and delivery was lightning fast!',
    avatar: '🌺',
  },
  {
    name: 'Arjun Mehta',
    rating: 5,
    text: 'As a manga enthusiast, I\'m thrilled by the collection. The bookshop feels warm and personal — not like a corporate store.',
    avatar: '⛩️',
  },
  {
    name: 'Sunita Verma',
    rating: 5,
    text: 'My children love the Hindi stories section. Leaf & Lore has rekindled our family\'s love for reading.',
    avatar: '📖',
  },
];

const languageCards = [
  { lang: 'English', emoji: '🇬🇧', color: '#2D5016', desc: '200+ titles' },
  { lang: 'Hindi', emoji: '🇮🇳', color: '#8B4513', desc: '80+ titles' },
  { lang: 'Marathi', emoji: '🌺', color: '#4A235A', desc: '60+ titles' },
  { lang: 'Japanese', emoji: '🗾', color: '#C41E3A', desc: '50+ titles' },
  { lang: 'Manga/Anime', emoji: '⛩️', color: '#1F618D', desc: '120+ titles' },
];

const genreTags = [
  'Fiction', 'Mystery', 'Romance', 'Fantasy', 'Self-help',
  'Non-fiction', "Children's", 'Manga', 'Poetry', 'History'
];

export default function HomePage() {
  const featuredBooks = books.slice(0, 6);

  return (
    <div style={{ backgroundColor: '#FAF7F2' }}>
      {/* Hero Section */}
      <section
        style={{ background: 'linear-gradient(135deg, #2D5016 0%, #1B4332 50%, #0D2B1A 100%)' }}
        className="relative overflow-hidden min-h-[88vh] flex items-center"
      >
        {/* Decorative floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <span className="absolute top-16 left-10 text-5xl opacity-20 animate-float">📚</span>
          <span className="absolute top-32 right-16 text-4xl opacity-15 animate-float2">🍃</span>
          <span className="absolute bottom-24 left-20 text-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}>🌿</span>
          <span className="absolute bottom-16 right-10 text-6xl opacity-10 animate-float2" style={{ animationDelay: '1s' }}>📖</span>
          <span className="absolute top-1/2 left-1/3 text-2xl opacity-10 animate-float" style={{ animationDelay: '3s' }}>✨</span>
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-5" style={{ backgroundColor: '#7A9E7E' }} />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-5" style={{ backgroundColor: '#8B4513' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8"
            style={{ backgroundColor: 'rgba(122,158,126,0.2)', color: '#7A9E7E', border: '1px solid rgba(122,158,126,0.3)' }}>
            <span>🍃</span> Your literary sanctuary awaits
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6" style={{ color: '#FAF7F2', fontFamily: 'var(--font-playfair), serif' }}>
            Where Every Page
            <br />
            <em style={{ color: '#7A9E7E' }}>Tells a Story</em>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'rgba(250,247,242,0.75)' }}>
            Discover books across five languages — English, Hindi, Marathi, Japanese & Manga/Anime.
            From timeless classics to contemporary voices.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#8B4513', color: 'white' }}
            >
              Explore Our Collection
            </Link>
            <Link
              href="/shop"
              className="px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105"
              style={{ border: '2px solid rgba(250,247,242,0.5)', color: '#FAF7F2' }}
            >
              Browse by Genre
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-2xl mx-auto">
            {[['500+', 'Books'], ['5', 'Languages'], ['10', 'Genres'], ['10k+', 'Readers']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: '#7A9E7E', fontFamily: 'var(--font-playfair), serif' }}>{num}</div>
                <div className="text-sm opacity-60" style={{ color: '#FAF7F2' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-3xl mb-4 block">🌿</span>
          <h2 className="text-4xl font-bold mb-3" style={{ color: '#2D5016', fontFamily: 'var(--font-playfair), serif' }}>Featured Reads</h2>
          <p className="text-gray-500 max-w-md mx-auto">Handpicked stories that will move, inspire, and transport you to other worlds.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="inline-block px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: '#2D5016', color: 'white' }}
          >
            View All Books →
          </Link>
        </div>
      </section>

      {/* Language Categories */}
      <section className="py-16" style={{ backgroundColor: '#F0EBE3' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3" style={{ color: '#2D5016', fontFamily: 'var(--font-playfair), serif' }}>Browse by Language</h2>
            <p className="text-gray-500">Stories told in the tongue closest to your heart</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {languageCards.map(({ lang, emoji, color, desc }) => (
              <Link
                key={lang}
                href="/shop"
                className="group rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ backgroundColor: color, color: 'white' }}
              >
                <div className="text-4xl mb-3">{emoji}</div>
                <div className="font-semibold text-sm mb-1" style={{ fontFamily: 'var(--font-playfair), serif' }}>{lang}</div>
                <div className="text-xs opacity-70">{desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Genre Tags */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-3" style={{ color: '#2D5016', fontFamily: 'var(--font-playfair), serif' }}>Explore by Genre</h2>
          <p className="text-gray-500">Find your next favourite in any category</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {genreTags.map(genre => (
            <Link
              key={genre}
              href="/shop"
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: '#FAF7F2', border: '1.5px solid #2D5016', color: '#2D5016' }}
            >
              {genre}
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16" style={{ backgroundColor: '#F0EBE3' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3" style={{ color: '#2D5016', fontFamily: 'var(--font-playfair), serif' }}>What Readers Say</h2>
            <p className="text-gray-500">Stories from our community of book lovers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-2xl p-6 shadow-md" style={{ backgroundColor: 'white', border: '1px solid #E8E0D5' }}>
                <div className="text-4xl mb-4">{t.avatar}</div>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-gray-600 mb-4 italic">"{t.text}"</p>
                <p className="font-semibold text-sm" style={{ color: '#2D5016' }}>— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20" style={{ backgroundColor: '#2D5016' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <span className="text-4xl block mb-4">📖</span>
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#FAF7F2', fontFamily: 'var(--font-playfair), serif' }}>Stay in the Story</h2>
          <p className="mb-8 leading-relaxed" style={{ color: 'rgba(250,247,242,0.75)' }}>
            Subscribe for curated reading lists, new arrivals, author spotlights, and members-only discounts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3 rounded-full outline-none text-sm"
              style={{ backgroundColor: '#FAF7F2', color: '#1a1a1a' }}
            />
            <button
              className="px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: '#8B4513', color: 'white' }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
