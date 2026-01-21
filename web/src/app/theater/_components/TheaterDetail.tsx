'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUserStore } from 'src/store/userStore';
import LoginModal from 'src/ui/modal/LoginModal';
import { TheaterDetailResponse } from 'src/types/theater/theater-type';

export interface Props {
  theaterId: string;
  data: TheaterDetailResponse;
}

const TheaterDetail = ({ theaterId, data }: Props) => {
  const { name, description, main_img, show_time, total_time, price, type } = data;

  const router = useRouter();
  const { id } = useUserStore();
  const [showModal, setShowModal] = useState(false);

  const isMusical = String(type).toLowerCase().includes('musical');

  // ✅ async로 바꿔야 await 사용 가능
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
              {/* Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={[
                    'rounded-full px-3 py-1 text-xs font-semibold ring-1',
                    isMusical
                      ? 'bg-yellow-500/15 text-yellow-200 ring-yellow-500/30'
                      : 'bg-sky-500/15 text-sky-200 ring-sky-500/30',
                  ].join(' ')}
                >
                  {isMusical ? 'MUSICAL' : 'CINEMA'}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 ring-1 ring-white/15">
                  STAGE_101 ORIGINAL
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 ring-1 ring-white/15">
                  {type}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{name}</h1>

              {/* Meta */}
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
                    {Number(price).toLocaleString()}원
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-white/75 sm:text-base">
                {description}
              </p>

              {/* 예매 버튼 */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={handleReservationGo}
                  className="w-full rounded-xl bg-yellow-500 px-6 py-3 font-extrabold text-black shadow-lg shadow-yellow-500/20 transition hover:bg-yellow-400 sm:w-auto"
                >
                  예매하기
                </button>
                <div className="text-xs text-white/55">
                  * 포트폴리오용 테스트 결제 입니다. 실제 결제/예매가 아닙니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 아래 섹션들 */}
      <div className="mx-auto w-full max-w-6xl px-5 pb-14">
        <div className="bg-white/5 p-6 rounded-lg shadow-md mt-6 w-full">
          <p className="text-gray-300">{description}</p>
        </div>

        <div className="bg-white/5 p-6 mt-6 w-full">
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

        {/* ✅ 모달도 여기서 그대로 */}
        <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </div>
    </div>
  );
};

export default TheaterDetail;
