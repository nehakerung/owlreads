import type { Metadata } from 'next';
import { Ubuntu } from 'next/font/google';
import '@/styles/globals.css';
import '@/components/ui/buttons.module.css';
import Navbar from '@/components/navbar/NavBar';
import Footer from '@/components/footer/footer';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
const ubuntu = Ubuntu({ subsets: ['latin'], weight: ['400', '500', '700'] });

export const metadata: Metadata = {
  title: 'OwlReads',
  description: 'Read. Share. Discover.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={ubuntu.className}>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
