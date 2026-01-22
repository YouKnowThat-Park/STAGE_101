import { NowShowingSection } from './home/NowShowingSection';
import FloorGuideSection from './home/FloorGuideSection';
import Stage101RooftopSection from './home/Stage101RooftopSection';
import NoticeSection from './home/NoticeSection';

const INNER = 'max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12';

export default function Home() {
  return (
    <main className="w-full min-h-screen">
      <section className="relative bg-black text-white">
        <div className={`${INNER} relative py-10 z-[9999]`}>
          <NowShowingSection />
        </div>
      </section>

      <section className="bg-white">
        <div className={`${INNER} relative pb-16 `}>
          <Stage101RooftopSection />
        </div>
      </section>

      <section className="bg-[#2A2461]">
        <div className={`${INNER} py-16`}>
          <NoticeSection />
        </div>
      </section>

      <section className="bg-[#FBFBFB]">
        <div className={`${INNER} py-16`}>
          <div className="p-6 md:p-10">
            <FloorGuideSection />
          </div>
        </div>
      </section>
    </main>
  );
}
