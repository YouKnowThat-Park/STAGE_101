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
    <div
      className="
    flex justify-center items-center px-10 py-14 gap-5
    max-[755px]:overflow-x-auto
    max-[755px]:whitespace-nowrap
    max-[755px]:scroll-smooth
    max-[755px]:cursor-grab
    max-[755px]:active:cursor-grabbing
    max-[755px]:[-webkit-overflow-scrolling:touch]
    max-[755px]:[scrollbar-width:none]
    max-[755px]:[&::-webkit-scrollbar]:hidden
  "
    >
      <button
        onClick={() => router.push('/')}
        className="text-2xl font-bold
        "
      >
        STAGE_101
      </button>
      <button onClick={handleGoBack}>상영 예정</button>
      {theaters.map((theater) => (
        <button
          key={theater.id}
          onClick={() => router.push(`/theater/${theater.id}`)} // ✅ URL 이동!
          className="block p-4 "
        >
          {theater.name}
        </button>
      ))}
    </div>
  );
};

export default TheaterList;
