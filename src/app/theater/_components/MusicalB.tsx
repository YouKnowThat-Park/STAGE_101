import { useUserStore } from '@/store/userStore';
import LoginModal from '@/ui/modal/LoginModal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

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

const MusicalB = ({
  theaterId,
  name,
  description,
  price,
  show_time,
  main_img,
  total_time,
}: MusicalAProps) => {
  const router = useRouter();
  const { id } = useUserStore();
  const [showModal, setShowModal] = useState(false);

  const handleReservationGo = async () => {
    if (!id) {
      setShowModal(true);
      return;
    }

    sessionStorage.setItem('allowPaymentsAccess', 'true');

    // 🔐 렌더 타이밍 충돌 방지용 강제 지연
    await new Promise((resolve) => setTimeout(resolve, 30));

    router.push(`/payments/${theaterId}`);
  };

  return (
    <div className="text-white min-h-screen p-6 flex flex-col items-center">
      {/* 🎬 포스터 및 정보 */}
      <div className="flex flex-col w-full max-w-4xl">
        <Image
          src={main_img}
          alt="뮤지컬 포스터"
          width={1000}
          height={500}
          className="rounded-lg shadow-lg"
        />
      </div>

      <div className="w-full max-w-4xl flex justify-between items-center mt-4">
        <h2 className="text-4xl font-bold">{name}</h2>
        <div className="text-right">
          <p className="text-xl">
            상영 시간: {show_time} / {total_time}분
          </p>
          <p className="text-lg font-semibold text-yellow-400 mt-1">
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

        {/* 🎭 연극 무대 */}
        <div className="flex justify-center my-4">
          <div className="bg-[#494744] text-white text-center py-6 w-40 h-20 rounded-md text-xl font-bold">
            STAGE
          </div>
        </div>

        {/* 🪑 좌석 UI */}
        <div className="flex flex-col items-center gap-2 mt-6 w-full px-2">
          {SEATS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-[4px] w-full">
              {row.map((seat, seatIndex) => (
                <div
                  key={seatIndex}
                  className="
            flex items-center justify-center 
            bg-[#374151] text-white rounded-md 
            hover:bg-[#4b5563] transition
            text-[2.8vw] sm:text-[1.8vw] md:text-sm 
            w-[7.5vw] h-[7.5vw] 
            min-w-[24px] min-h-[24px] 
            max-w-[36px] max-h-[36px]"
                >
                  {seat}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* 🛒 예약 버튼 */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleReservationGo}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-md transition"
          >
            좌석 예약
          </button>
        </div>
      </div>

      <div className="bg-[#3c3a37] p-6  mt-6 w-full max-w-4xl">
        <h2 className="text-xl font-bold text-red-400 mb-3">⚠️ 관람 안내 및 유의 사항</h2>
        <ul className="text-gray-300 space-y-2 list-disc pl-6">
          <li>공연이 시작된 후에는 입장이 제한될 수 있습니다.</li>
          <li>모든 좌석은 지정 좌석제로 운영되며, 임의로 좌석을 변경할 수 없습니다.</li>
          <li>공연 중 사진 촬영, 녹음 및 영상 촬영은 금지됩니다.</li>
          <li>음식물 반입이 제한될 수 있으며, 음료는 지정된 장소에서만 섭취 가능합니다.</li>
          <li>티켓 취소 및 환불 규정은 공연 기획사 정책에 따라 다를 수 있습니다.</li>
          <li>안전한 관람을 위해 어린이 및 노약자는 보호자의 동반이 필요합니다.</li>
          <li>모든 공연은 주최 측 사정에 따라 변경 또는 취소될 수 있습니다.</li>
        </ul>

        <h2 className="text-xl font-bold text-red-400 mt-6">⚠️ 중요 공지</h2>
        <p className="text-gray-300 mt-2">
          이 페이지는 <span className="text-red-400 font-bold">실제 예매 페이지가 아닙니다.</span>
          <br />
          **모든 극장 위치, 연극 및 공연 정보는 임의로 만들어진 가상의 콘텐츠**이며, 예매 및 결제
          기능은 테스트 용도로만 제공됩니다.
          <br />
          실제 공연 관람을 원하신다면 <span className="text-yellow-400 font-bold">공식 예매처</span>
          를 이용해주세요.
        </p>
      </div>
      <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default MusicalB;
