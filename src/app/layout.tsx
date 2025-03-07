import type { Metadata } from 'next';
import { Noto_Serif_KR } from 'next/font/google';
import './globals.css';
import Providers from './_providers/providers';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

const notoSerif = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'STAGE_101 | 극장 정보',
  description: 'STAGE_101에서 제공하는 다양한 극장 정보를 확인하세요.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${notoSerif.className} min-h-screen bg-black`}>
        <Providers>
          <div className="max-w-screen-2xl mx-auto px-56">
            <Header />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
