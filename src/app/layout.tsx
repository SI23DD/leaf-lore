import type { Metadata } from 'next';
import { Poppins, Nunito } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@frontend/context/CartContext';
import { AuthProvider } from '@frontend/context/AuthContext';
import { WishlistProvider } from '@frontend/context/WishlistContext';
import Navbar from '@frontend/components/Navbar';
import Footer from '@frontend/components/Footer';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Leaf & Lore — Where Every Page Tells a Story',
  description: 'A curated bookshop celebrating stories across languages and genres.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${nunito.variable}`}>
      <body style={{ backgroundColor: '#ffffff', fontFamily: 'var(--font-poppins), system-ui, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
