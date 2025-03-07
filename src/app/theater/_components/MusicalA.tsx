import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

interface MusicalAProps {
  theaterId: string;
  name: string;
  description: string;
  price: number;
  show_time: string;
  main_img: string;
  total_time: number;
}

// 🎭 좌석 배열 (기본 직선 형태)
const SEATS = [
  ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'],
  ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10'],
  ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'],
  ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'],
  ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10'],
];

const MusicalA = ({
  theaterId,
  name,
  description,
  price,
  show_time,
  main_img,
  total_time,
}: MusicalAProps) => {
  const router = useRouter();

  const handleReservationGo = () => {
    router.push(`/payments/${theaterId}`); // ✅ theaterId를 포함해서 전달
  };

  return (
    <div className=" text-white min-h-screen p-6 flex flex-col items-center">
      {/* 🎬 영화 포스터 & 정보 */}
      <div className="flex gap-20 w-full max-w-4xl">
        <Image
          src={main_img}
          alt="영화 포스터"
          width={300}
          height={500}
          className="rounded-lg shadow-lg"
        />
        <div className="flex flex-col justify-center">
          <p className="font-bold text-4xl">{name}</p>
          <div className="flex justify-center items-center gap-2 text-gray-300">
            <p className="text-xl">상영 시간: {show_time}</p>
            <p>/</p>
            <p className="text-lg">{total_time}분</p>
          </div>
          <p className="text-2xl font-semibold mt-4 text-yellow-400">
            가격: {price.toLocaleString()}원
          </p>
        </div>
      </div>

      {/* 📖 공연 설명 */}
      <div className="bg-[#3c3a37] p-6 rounded-lg shadow-md mt-6 w-full max-w-4xl">
        <p className="text-gray-300">{description}</p>
      </div>

      {/* 🎭 좌석 배치 */}
      <div className="bg-[#3c3a37] p-6 rounded-lg shadow-md mt-6 w-full max-w-4xl">
        <p className="text-center text-xl font-semibold mb-4">좌석 선택</p>

        {/* 🎭 연극 무대 (가운데 정렬) */}
        <div className="flex justify-center my-4">
          <div className="bg-[#494744] text-white text-center py-6 w-40 h-20 rounded-md text-xl font-bold">
            STAGE
          </div>
        </div>

        {/* 🪑 좌석 UI */}
        <div className="flex flex-col items-center gap-2 mt-6">
          {SEATS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2">
              {row.map((seat, seatIndex) => (
                <div
                  key={seatIndex}
                  className="w-10 h-10 flex items-center justify-center bg-gray-700 text-white rounded-md cursor-pointer hover:bg-gray-500 transition"
                >
                  {seat}
                </div>
              ))}
            </div>
          ))}
          <button onClick={handleReservationGo} className="ml-[700px]">
            좌석 예약
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicalA;
