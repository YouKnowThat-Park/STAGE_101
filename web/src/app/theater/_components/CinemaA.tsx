import { useUserStore } from '../../../store/userStore';
import LoginModal from '../../../ui/modal/LoginModal';
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

const CinemaA = ({
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
    <div className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* STAGE_101 시그니처 배경 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,200,80,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(80,160,255,0.12),_transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/70 to-black" />

        <div className="relative mx-auto w-full max-w-6xl px-5 py-10 lg:py-14">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
            {/* Poster */}
            <div className="rounded-2xl bg-white/5 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
              <Image
                src={main_img}
                alt="포스터"
                width={600}
                height={900}
                className="h-auto w-full rounded-xl object-cover"
                priority
              />
            </div>

            {/* Info */}
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              {/* Badge (고정 텍스트만) */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-semibold text-yellow-200 ring-1 ring-yellow-500/30">
                  STAGE_101 ORIGINAL
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{name}</h1>

              {/* Meta (네 값 그대로) */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-black/30 p-4 ring-1 ring-white/10">
                  <p className="text-xs text-white/60">상영 시간</p>
                  <p className="mt-1 text-lg font-semibold">
                    {show_time} <span className="text-white/60">/ {total_time}분</span>
                  </p>
                </div>
                <div className="rounded-xl bg-black/30 p-4 ring-1 ring-white/10">
                  <p className="text-xs text-white/60">가격</p>
                  <p className="mt-1 text-lg font-extrabold text-yellow-300">
                    {price.toLocaleString()}원
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-white/75 sm:text-base">
                {description}
              </p>

              {/* 예매 버튼만 */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={handleReservationGo}
                  className="w-full rounded-xl bg-yellow-500 px-6 py-3 font-extrabold text-black shadow-lg shadow-yellow-500/20 transition hover:bg-yellow-400 sm:w-auto"
                >
                  예매하기
                </button>

                <div className="text-xs text-white/55">
                  * 포트폴리오용 데모입니다. 실제 결제/예매가 아닙니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 기존 아래 섹션들 그대로 */}
      <div className="mx-auto w-full max-w-6xl px-5 pb-14">
        <div className="bg-[#3c3a37] p-6 rounded-lg shadow-md mt-6 w-full">
          <p className="text-gray-300">{description}</p>
        </div>

        <div className="bg-[#3c3a37] p-6 mt-6 w-full">
          <h2 className="text-xl font-bold text-red-400 mb-3">⚠️ 관람 안내 및 유의 사항</h2>
          <ul className="text-gray-300 space-y-2 list-disc pl-6">
            <li>공연이 시작된 후에는 입장이 제한될 수 있습니다.</li>
            <li>공연 중 사진 촬영, 녹음 및 영상 촬영은 금지됩니다.</li>
            <li>티켓 취소 및 환불 규정은 공연 기획사 정책에 따라 다를 수 있습니다.</li>
            <li>모든 공연은 주최 측 사정에 따라 변경 또는 취소될 수 있습니다.</li>
          </ul>

          <h2 className="text-xl font-bold text-red-400 mt-6">⚠️ 중요 공지</h2>
          <p className="text-gray-300 mt-2">
            이 페이지는 <span className="text-red-400 font-bold">실제 예매 페이지가 아닙니다.</span>
            <br />
            모든 정보는 가상의 콘텐츠이며, 예매 및 결제 기능은 테스트 용도로만 제공됩니다.
          </p>
        </div>

        <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </div>
    </div>
  );
};

export default CinemaA;
