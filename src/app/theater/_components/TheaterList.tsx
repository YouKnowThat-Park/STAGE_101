'use client';
import { useRouter } from 'next/navigation';

const TheaterList = () => {
  const router = useRouter();

  const theaters = [
    { id: 'cinemaA', name: '뮤지컬 A관' },
    { id: 'musicalA', name: '뮤지컬 B관' },
    { id: 'musicalB', name: '뮤지컬 C관' },
    { id: 'cinemaB', name: '시네마 A관' },
  ];

  const handleGoBack = () => {
    router.push('/theater');
  };

  return (
    <div className="px-10 py-14 max-[755px]:px-0">
      <div
        className="
          max-[755px]:overflow-x-auto
          max-[755px]:scroll-smooth
          max-[755px]:whitespace-nowrap
          max-[755px]:cursor-grab
          max-[755px]:active:cursor-grabbing
          max-[755px]:[-webkit-overflow-scrolling:touch]
          max-[755px]:[scrollbar-width:none]
          max-[755px]:[&::-webkit-scrollbar]:hidden
        "
      >
        <div
          className="
            flex justify-center items-center gap-5
            w-full
            max-[755px]:inline-flex
            max-[755px]:w-max
            max-[755px]:min-w-[900px]
            px-10
          "
        >
          <button
            onClick={() => router.push('/')}
            className="text-2xl font-bold shrink-0 min-w-max"
          >
            STAGE_101
          </button>
          <button onClick={handleGoBack} className="shrink-0 min-w-max">
            상영 예정
          </button>
          {theaters.map((theater) => (
            <button
              key={theater.id}
              onClick={() => router.push(`/theater/${theater.id}`)}
              className="block p-4 shrink-0 min-w-max"
            >
              {theater.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TheaterList;
