import Image from 'next/image';
import React from 'react';

const NoticeSection = () => {
  return (
    <section className="mt-16 w-full">
      <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-[#0B0B0B] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
        {/* 데스크탑: 좌-텍스트-우 / 모바일: 위아래 스택 */}
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-[1fr_1.2fr_1fr]">
          {/* LEFT IMAGE */}
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#111]">
            <div className="relative aspect-[2/3] w-full">
              <Image
                src="/STAGE101_rooftop.webp"
                alt="토스페이 결제 안내"
                fill
                className="object-cover opacity-95"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
            {/* subtle overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          </div>

          {/* CENTER TEXT (between images) */}
          <div className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-[#0E0E0E] p-5">
            {/* TOP TEXT (for left image) */}
            <div>
              <p className="text-xs tracking-widest text-[#C9A66B]/90">PAYMENT NOTICE</p>
              <h3 className="mt-2 text-lg font-semibold text-white">토스페이 테스트 결제 안내</h3>
              <p className="mt-2 leading-relaxed text-sm text-white/80">
                해당 결제 시스템은 <span className="text-white">테스트용</span>으로, 결제 UI 흐름은
                실제 결제와 동일하지만{' '}
                <span className="text-[#C9A66B]">실제 결제는 진행되지 않습니다</span>. 안심하고
                이용해 주세요.
              </p>
            </div>

            <div className="h-px w-full bg-white/10" />

            {/* BOTTOM TEXT (for right image) */}
            <div>
              <p className="text-xs tracking-widest text-[#C9A66B]/90">CONTENT NOTICE</p>
              <h3 className="mt-2 text-lg font-semibold text-white">이미지/사진 출처 안내</h3>
              <p className="mt-2 leading-relaxed text-sm text-white/80">
                본 페이지에 사용된 이미지 및 사진들은 <span className="text-white">AI 툴</span> 또는{' '}
                <span className="text-white">제작자</span>가 제작/촬영한 자료입니다.
              </p>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#111]">
            <div className="relative aspect-[2/3] w-full">
              <Image
                src="/STAGE101_rooftop.webp"
                alt="이미지 및 사진 출처 안내"
                fill
                className="object-cover opacity-95"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoticeSection;
