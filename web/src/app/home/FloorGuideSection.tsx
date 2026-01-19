import Image from 'next/image';
import React from 'react';

const FloorGuideSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1100px] mx-auto flex items-center justify-center gap-10">
        <div className="relative w-[300px] h-[420px]">
          <Image src="/STAGE101_floor_guide.webp" alt="층별 안내" fill className="object-contain" />
        </div>
        {/* 텍스트 */}
        <div className="flex flex-col gap-3 max-w-md text-[#222]">
          <h2 className="text-2xl font-semibold text-[#111]">STAGE101 층별 안내</h2>

          <ul className="text-sm text-[#444] space-y-2 leading-relaxed">
            <li>
              <b>ROOF</b> – 도심 야경을 즐길 수 있는 루프탑 바.
            </li>
            <li>
              <b>4F</b> – 메인 공연장, 대형 공연과 뮤지컬.
            </li>
            <li>
              <b>3F</b> – 중·소형 공연장, 연극과 다양한 장르.
            </li>
            <li>
              <b>2F</b> – 창작 공연 공간, 실험적 작품.
            </li>
            <li>
              <b>1F</b> – 카페 & 레스토랑.
            </li>
            <li>
              <b>B1</b> – 굿즈샵, 한정 상품 판매.
            </li>
          </ul>
        </div>

        {/* 이미지 */}
      </div>
    </section>
  );
};

export default FloorGuideSection;
