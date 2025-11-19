import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import Providers from './_providers/providers';
import { getCurrentUser } from 'src/lib/api/user/useServerUser';
import LayoutSwitcher from './_components/LayoutSwitcher';

const notoSans = Noto_Sans_KR({
  subsets: ['latin'], // 'latin'만 넣어도 한글 포함됨
  weight: ['400', '700'], // 필요 시 300, 500도 추가 가능
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'STAGE_101 | 극장 정보',
  description: 'STAGE_101에서 제공하는 다양한 극장 정보를 확인하세요.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang="ko">
      <body className={`${notoSans.className} min-h-screen bg-black`}>
        <Providers initialUser={user}>
          <LayoutSwitcher user={user}>{children}</LayoutSwitcher>
        </Providers>
      </body>
    </html>
  );
}
