import Image from 'next/image';
import React from 'react';

const Stage101RooftopSection = () => {
  return (
    <section className="w-full bg-black mt-16 py-12 flex justify-center items-center ">
      <div className="max-w-screen-2xl mx-auto px-6 flex items-center gap-10">
        {/* 이미지 */}
        <div className="flex-shrink-0">
          <Image
            src="/STAGE101_rooftop.webp"
            alt="stage101 루프탑"
            width={300}
            height={500}
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* 텍스트 */}
        <div className="text-white max-w-lg">
          <h3 className="text-2xl font-semibold mb-4">stage101: 루프탑 이야기</h3>
          <p className="text-gray-300 leading-relaxed">
            도시의 불빛 위, STAGE101 루프탑에서 벌어지는 하루의 기록. 이곳은 공연이 끝난 사람들이
            모여 서로의 이야기를 나누는 또 하나의 무대입니다. 웃음, 설렘, 어색함, 그리고 진짜
            속마음까지— 카메라는 아무 꾸밈없는 순간들을 조용히 따라갑니다.
            <br />
            <br />
            누군가는 첫 만남의 떨림을, 누군가는 오래된 친구와의 추억을, 또 누군가는 혼자만의 시간을
            이 공간에서 만들어갑니다. ‘stage101: 루프탑’은 화려한 연출보다 사람 그 자체에 집중하는
            다큐 예능 형식의 영화로, 하루의 끝에서 시작되는 진짜 이야기를 담아냅니다.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Stage101RooftopSection;
