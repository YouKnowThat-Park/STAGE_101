import { fetchTheaterList } from 'src/lib/api/theater/fetchTheaterList';
import HomeClientPage from './home/HomeClientPage';

const INNER = 'max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12';

export const metadata = {
  title: 'STAGE101 | 공연·뮤지컬·무대 콘텐츠 플랫폼',
  description: '뮤지컬, 연극, 공연 정보를 제공하는 STAGE101 메인 페이지',
  alternates: {
    canonical: 'https://stage101.shop/',
  },
};

export default async function Page() {
  const data = await fetchTheaterList({
    status: false,
    limit: 10,
    offset: 0,
  });

  return (
    <main className="w-full min-h-screen">
      <section className="bg-black text-white">
        <div className={`${INNER} mt-20`}>
          <h1 className="text-3xl font-semibold text-[#C9A66B]">STAGE101 상영작</h1>
          <p className="mt-2 text-white/70">현재 상영 중인 공연과 무대 콘텐츠를 확인하세요.</p>
        </div>
      </section>

      <HomeClientPage initialData={data} />
    </main>
  );
}
