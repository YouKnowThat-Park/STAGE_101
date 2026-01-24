import Image from 'next/image';
import React from 'react';

const NoticeSection = () => {
  return (
    <section className="mt-12 w-full flex justify-center px-4">
      <div className="w-full max-w-6xl">
        <div className="rounded-2xl border  bg-[#FBFBFB] p-4 md:p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
          <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-[420px_1fr] items-stretch">
            {/* LEFT IMAGE */}
            <div className="relative overflow-hidden rounded-xl ">
              <div className="relative w-full aspect-[444/529]">
                <Image
                  src="/tosspay.webp"
                  alt="토스페이 결제 안내"
                  fill
                  sizes="(max-width: 768px) 92vw, 420px"
                  className="border"
                  priority
                />
              </div>
            </div>

            {/* RIGHT TEXT */}
            <div className="rounded-xl border  p-5 md:p-6 text-black">
              <div className="divide-y divide-white/10">
                {/* PAYMENT NOTICE */}
                <div className="pb-6">
                  <p className="text-xs tracking-widest text-[#C9A66B]/90">PAYMENT NOTICE</p>
                  <h3 className="mt-2 text-xl font-semibold">토스페이 테스트 결제 안내</h3>
                  <p className="mt-3 leading-relaxed text-sm">
                    해당 결제 시스템은 <span className="">테스트용</span>으로, 결제 UI 흐름은 실제
                    결제와 동일하지만
                    <span className="text-[#C9A66B]">실제 결제는 진행되지 않습니다</span>. 안심하고
                    이용해 주세요.
                  </p>
                </div>

                {/* CONTENT NOTICE */}
                <div className="py-6">
                  <p className="text-xs tracking-widest text-[#C9A66B]/90">CONTENT NOTICE</p>
                  <h3 className="mt-2 text-xl font-semibold ">이미지/사진 출처 안내</h3>
                  <p className="mt-3 leading-relaxed text-sm">
                    본 페이지에 사용된 이미지 및 사진들은 AI 툴 또는 제작자가 제작/촬영한
                    자료입니다.
                  </p>
                </div>

                {/* SHOP & POINT NOTICE */}
                <div className="pt-6">
                  <p className="text-xs tracking-widest text-[#C9A66B]/90">SHOP & POINT NOTICE</p>
                  <h3 className="mt-2 text-xl font-semibold ">굿즈 상점 · 포인트 안내</h3>

                  <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                    <li>
                      • 회원가입 시 <span className="font-medium">10,000P</span>가 기본 지급됩니다.
                    </li>
                    <li>
                      • 결제 완료 후 <span className=" font-medium">관람이 확인</span>되면 티켓
                      금액의 <span className="text-[#C9A66B] font-semibold">5%</span>가 포인트로
                      페이백됩니다.
                    </li>
                    <li>
                      • 적립된 포인트는 <span className=" font-medium">굿즈 상점</span>
                      에서 할인/결제에 사용할 수 있습니다.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /RIGHT TEXT */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoticeSection;
