import { fetchTheaterList } from 'src/lib/api/theater/fetchTheaterList';
import FloorGuideSection from './sections/FloorGuideSection';
import NoticeSection from './sections/NoticeSection';
import Stage101RooftopSection from './sections/Stage101RooftopSection';
import NowShowingSection from './sections/NowShowingSection';
import { BannerImage } from 'src/types/common/common-type';

const INNER = 'max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12';

const HomePageContent = async () => {
  const initialData = await fetchTheaterList({
    status: false,
    limit: 10,
    offset: 0,
  });

  const images: BannerImage[] = initialData.items.map((t) => ({
    id: String(t.id),
    src: t.main_img,
    alt: t.name,
    pos: 'center 30%',
    theaterKey: t.type,
  }));

  return (
    <>
      <section className="relative bg-black text-white">
        <div className={`${INNER} mb-10`}>
          <div className="relative rounded-lg p-2 mt-10 shadow-md">
            <NowShowingSection images={images} />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className={`${INNER} pb-16`}>
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
          <FloorGuideSection />
        </div>
      </section>
    </>
  );
};

export default HomePageContent;
