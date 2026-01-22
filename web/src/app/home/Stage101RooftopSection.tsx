import Image from 'next/image';
import React from 'react';

const shootImages = [
  { src: '/stage101_rooftop_shoot_1.webp', alt: '루프탑 촬영 스냅 1' },
  { src: '/stage101_rooftop_shoot_2.webp', alt: '루프탑 촬영 스냅 2' },
  { src: '/stage101_rooftop_shoot_3.webp', alt: '루프탑 촬영 스냅 3' },
  { src: '/stage101_rooftop_shoot_4.webp', alt: '루프탑 촬영 스냅 4' },
];

const Stage101RooftopSection = () => {
  return (
    <section className="w-full bg-white  py-20 md:py-28 ">
      <div className="max-w-screen-2xl mx-auto px-6 relative">
        <div className="flex flex-col lg:flex-row lg:items-center gap-14 lg:gap-16">
          {/* 이미지 영역 */}
          <div>
            {/* 메인 이미지 */}
            <a href="/theater/musicalC">
              <Image
                src="/STAGE101_rooftop.webp"
                alt="stage101 루프탑"
                width={340}
                height={520}
                className="rounded-2xl shadow-xl"
                priority
              />
            </a>
          </div>

          {/* 텍스트 */}
          <div className="max-w-2xl flex flex-col min-h-[520px]">
            {/* 텍스트는 위에 고정 */}
            <div className="mt-20 ">
              <a
                href="/theater/musicalC"
                className="group inline-block w-full"
                aria-label="STAGE101: 루프탑 이야기 보러가기"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6 text-[#C9A66B]">
                    STAGE101: 루프탑 이야기
                  </h3>

                  <span className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm md:text-base font-medium text-gray-900 bg-white ring-1 ring-black/10 shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:ring-black/20">
                    보러가기
                    <span className="transition group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </a>
              <div className="border-[0.5px] border-black/80 mb-2" />

              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                도시의 불빛 위, STAGE101 루프탑에서 벌어지는 하루의 기록. 이곳은 공연이 끝난
                사람들이 모여 서로의 이야기를 나누는 또 하나의 무대입니다. 웃음, 설렘, 어색함,
                그리고 진짜 속마음까지— 카메라는 아무 꾸밈없는 순간들을 조용히 따라갑니다.
                <br />
                <br />
                누군가는 첫 만남의 떨림을, 누군가는 오래된 친구와의 추억을, 또 누군가는 혼자만의
                시간을 이 공간에서 만들어갑니다. ‘stage101: 루프탑’은 화려한 연출보다 사람 그 자체에
                집중하는 다큐 예능 형식의 영화로, 하루의 끝에서 시작되는 진짜 이야기를 담아냅니다.
              </p>
            </div>

            {/* 썸네일 이미지는 아래로 내려감 */}
            <div className="mt-auto pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {shootImages.map((img, idx) => (
                  <div
                    key={`${img.src}-${idx}`}
                    className="rounded-2xl bg-white shadow-xl ring-1 ring-black/10 hover:scale-[1.02] transition"
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
                      <Image src={img.src} alt={img.alt} fill className="object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stage101RooftopSection;
