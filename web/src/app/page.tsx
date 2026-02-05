import { fetchTheaterList } from 'src/lib/api/theater/fetchTheaterList';
import HomeClientPage from './home/HomeClientPage';

const INNER = 'max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12';

export default async function Page() {
  const data = await fetchTheaterList({
    status: false,
    limit: 10,
    offset: 0,
  });

  return (
    <main className="w-full min-h-screen">
      <section className="bg-black text-white">
        <div className={`${INNER} py-10`}>
          <h1 className="text-3xl font-semibold text-[#C9A66B]">STAGE101 상영작</h1>
          <p className="mt-2 text-white/70">현재 상영 중인 공연과 무대 콘텐츠를 확인하세요.</p>
        </div>
      </section>

      <HomeClientPage initialData={data} />
    </main>
  );
}
