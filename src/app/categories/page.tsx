'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CategoryDef {
  name: string;
  emoji: string;
  description: string;
  color: string;
}

interface LanguageDef {
  name: string;
  flag: string;
  queryVal: string;
}

const CATEGORIES: CategoryDef[] = [
  { name: 'Fiction', emoji: '🗡️', description: 'Stories that transport you to worlds real and imagined', color: '#EFF6E8' },
  { name: 'Non-fiction', emoji: '📰', description: 'Ideas, facts, and truths that reshape how you see the world', color: '#FEF9EE' },
  { name: 'Mystery', emoji: '🔍', description: 'Puzzles, crimes, and revelations that hold you until the last page', color: '#F3F0FB' },
  { name: 'Romance', emoji: '💕', description: 'Love in every shade — tender, fierce, heartbreaking, triumphant', color: '#FEF0F0' },
  { name: 'Fantasy', emoji: '🏰', description: 'Magic systems, mythic quests, and worlds that never existed', color: '#EDF4FF' },
  { name: 'Self-help', emoji: '💡', description: 'Practical wisdom for the life you want to build', color: '#FFFBEA' },
  { name: "Children's", emoji: '👶', description: 'Picture books, chapter books, and stories that stick forever', color: '#FFF0F6' },
  { name: 'Manga', emoji: '📖', description: 'Japanese sequential art spanning every emotion and genre', color: '#F0FAFA' },
  { name: 'Poetry', emoji: '🖊️', description: 'Language distilled — each line carries the weight of a sentence', color: '#FAF0FF' },
  { name: 'History', emoji: '📜', description: 'The past that explains the present and shapes the future', color: '#FFF5EE' },
];

const LANGUAGES: LanguageDef[] = [
  { name: 'English', flag: '🇬🇧', queryVal: 'English' },
  { name: 'Japanese', flag: '🇯🇵', queryVal: 'Japanese' },
  { name: 'Hindi', flag: '🌸', queryVal: 'Hindi' },
  { name: 'Marathi', flag: '🎭', queryVal: 'Marathi' },
  { name: 'Manga/Anime', flag: '⚡', queryVal: 'Manga/Anime' },
];

const FEATURED = [
  { label: 'New Arrivals', desc: 'Fresh off the press — the latest additions to our shelves', icon: '✨', param: 'sort=created_at&order=desc' },
  { label: 'Bestsellers', desc: 'The books our readers keep coming back for', icon: '🏆', param: 'sort=rating&order=desc' },
  { label: 'Under ₹300', desc: 'Great reads that are gentle on your wallet', icon: '💰', param: 'maxPrice=299' },
];

const MARQUEE_WORDS = ['Fiction', 'Mystery', 'Romance', 'Fantasy', 'Poetry', 'History', 'Manga', 'Non-fiction', 'Self-help', "Children's"];

export default function CategoriesPage() {
  const router = useRouter();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [langCounts, setLangCounts] = useState<Record<string, number>>({});
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Fetch all books once, count client-side for snappiness
    fetch('/api/books?limit=500')
      .then(r => r.json())
      .then(data => {
        const books: Array<{ genre: string; language: string }> = data.books || [];
        const genreCounts: Record<string, number> = {};
        const langC: Record<string, number> = {};
        books.forEach(b => {
          genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
          langC[b.language] = (langC[b.language] || 0) + 1;
        });
        setCounts(genreCounts);
        setLangCounts(langC);
      })
      .catch(() => {});

    // Trigger entrance animations
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  const goToShop = (param: string, value: string) => {
    router.push(`/shop?${param}=${encodeURIComponent(value)}`);
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', fontFamily: 'var(--font-lato), sans-serif' }}>

      {/* ── Hero ── */}
      <section
        style={{
          backgroundColor: '#2D5016',
          position: 'relative',
          overflow: 'hidden',
          padding: '80px 0 64px',
        }}
      >
        {/* Marquee wall — the aesthetic risk: library-wall genre names drifting behind the headline */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            overflow: 'hidden',
            opacity: 0.09,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {[0, 1, 2].map(row => (
            <div
              key={row}
              style={{
                display: 'flex',
                whiteSpace: 'nowrap',
                animation: `marquee${row % 2 === 0 ? 'L' : 'R'} ${28 + row * 6}s linear infinite`,
                padding: '12px 0',
              }}
            >
              {[...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS].map((w, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    fontSize: row === 1 ? '56px' : '40px',
                    fontWeight: 700,
                    color: '#FAF7F2',
                    marginRight: 48,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {w}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Foreground headline */}
        <div
          style={{
            position: 'relative',
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 32px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: 'rgba(250,247,242,0.55)',
              fontSize: 13,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 20,
              fontFamily: 'var(--font-lato), sans-serif',
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'none' : 'translateY(12px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            Leaf &amp; Lore · Library Index
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-playfair), serif',
              color: '#FAF7F2',
              fontSize: 'clamp(40px, 7vw, 76px)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: 24,
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'none' : 'translateY(20px)',
              transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
            }}
          >
            Explore by Category
          </h1>
          <p
            style={{
              color: 'rgba(250,247,242,0.65)',
              fontSize: 18,
              maxWidth: 480,
              margin: '0 auto',
              lineHeight: 1.6,
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'none' : 'translateY(12px)',
              transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
            }}
          >
            Every shelf tells a story. Find yours.
          </p>
        </div>

        {/* Keyframes injected inline via style tag */}
        <style>{`
          @keyframes marqueeLRtl {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          @keyframes marqueeL {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          @keyframes marqueeR {
            from { transform: translateX(-50%); }
            to { transform: translateX(0); }
          }
        `}</style>
      </section>

      {/* ── Category Grid ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 32px 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 20,
          }}
        >
          {CATEGORIES.map((cat, i) => {
            const isHovered = hoveredCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => goToShop('genre', cat.name)}
                onMouseEnter={() => setHoveredCategory(cat.name)}
                onMouseLeave={() => setHoveredCategory(null)}
                style={{
                  background: isHovered ? '#fff' : cat.color,
                  border: isHovered ? '2px solid #2D5016' : '2px solid transparent',
                  borderRadius: 20,
                  padding: '32px 24px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'none',
                  boxShadow: isHovered ? '0 16px 40px rgba(45,80,22,0.16)' : '0 2px 8px rgba(0,0,0,0.04)',
                  opacity: loaded ? 1 : 0,
                  animationFillMode: 'both',
                }}
                className={loaded ? `animate-fadeInUp delay-${Math.min((i % 4 + 1) * 100, 400) as 100 | 200 | 300 | 400}` : ''}
              >
                <div style={{ fontSize: 44, marginBottom: 14, lineHeight: 1 }}>{cat.emoji}</div>
                <h2
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#1a1a1a',
                    marginBottom: 6,
                    lineHeight: 1.2,
                  }}
                >
                  {cat.name}
                </h2>
                <p
                  style={{
                    fontSize: 12,
                    color: '#2D5016',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    marginBottom: isHovered ? 12 : 0,
                  }}
                >
                  {counts[cat.name] !== undefined ? `${counts[cat.name]} book${counts[cat.name] === 1 ? '' : 's'}` : '— books'}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: '#555',
                    lineHeight: 1.55,
                    maxHeight: isHovered ? '80px' : '0px',
                    overflow: 'hidden',
                    opacity: isHovered ? 1 : 0,
                    transition: 'max-height 0.3s ease, opacity 0.3s ease',
                  }}
                >
                  {cat.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Language Filter Row ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 32px 0' }}>
        <div style={{ marginBottom: 28 }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#8B4513',
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Browse by Language
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 28,
              fontWeight: 700,
              color: '#1a1a1a',
              margin: 0,
            }}
          >
            Stories in Every Tongue
          </h2>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          {LANGUAGES.map(lang => (
            <button
              key={lang.name}
              onClick={() => goToShop('language', lang.queryVal)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '16px 24px',
                borderRadius: 14,
                border: '1.5px solid #E8E0D5',
                backgroundColor: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#2D5016';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(45,80,22,0.12)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#E8E0D5';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLButtonElement).style.transform = 'none';
              }}
            >
              <span style={{ fontSize: 28 }}>{lang.flag}</span>
              <div style={{ textAlign: 'left' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    fontWeight: 700,
                    fontSize: 15,
                    color: '#1a1a1a',
                    lineHeight: 1.2,
                  }}
                >
                  {lang.name}
                </div>
                <div style={{ fontSize: 11, color: '#2D5016', fontWeight: 600, marginTop: 2 }}>
                  {langCounts[lang.queryVal] !== undefined
                    ? `${langCounts[lang.queryVal]} book${langCounts[lang.queryVal] === 1 ? '' : 's'}`
                    : '— books'}
                </div>
              </div>
              <span
                style={{
                  marginLeft: 4,
                  color: '#2D5016',
                  fontSize: 16,
                  opacity: 0.6,
                }}
              >
                →
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Featured Collections ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 32px 80px' }}>
        <div style={{ marginBottom: 28 }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#8B4513',
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Curated Collections
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 28,
              fontWeight: 700,
              color: '#1a1a1a',
              margin: 0,
            }}
          >
            Hand-Picked for You
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          {FEATURED.map(col => (
            <button
              key={col.label}
              onClick={() => router.push(`/shop?${col.param}`)}
              style={{
                padding: '36px 32px',
                borderRadius: 20,
                backgroundColor: '#2D5016',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 20px 48px rgba(45,80,22,0.3)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'none';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              {/* Background texture glyph */}
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  right: 20,
                  bottom: -10,
                  fontSize: 72,
                  opacity: 0.12,
                  lineHeight: 1,
                }}
              >
                {col.icon}
              </span>

              <div style={{ fontSize: 32, marginBottom: 16 }}>{col.icon}</div>
              <h3
                style={{
                  fontFamily: 'var(--font-playfair), serif',
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#FAF7F2',
                  marginBottom: 10,
                  lineHeight: 1.2,
                }}
              >
                {col.label}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: 'rgba(250,247,242,0.65)',
                  lineHeight: 1.55,
                  marginBottom: 24,
                }}
              >
                {col.desc}
              </p>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#FAF7F2',
                  borderBottom: '1.5px solid rgba(250,247,242,0.4)',
                  paddingBottom: 2,
                  letterSpacing: '0.04em',
                }}
              >
                Browse collection →
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
