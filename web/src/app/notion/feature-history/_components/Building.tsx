'use client';

import { useState } from 'react';

const Building = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white  px-4">
      <div className="max-w-2xl mx-auto border border-gray-300 rounded-md shadow-md mb-6">
        {/* 드롭다운 토글 버튼 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-6 py-4 bg-gray-100 hover:bg-gray-200 font-semibold text-lg transition flex justify-between items-center"
        >
          <span>✅건물 구조 & 도면 기반 설계</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </button>

        {/* 내용 */}
        {isOpen && (
          <div className="px-6 py-5 bg-white space-y-4 text-gray-800 text-sm leading-relaxed">
            <h3 className="font-bold text-base">3. 건물 도면 기반 UI 기획</h3>

            <div>
              <p className="font-semibold">📌 기획 의도</p>
              <p>
                단순한 공연 예약 플랫폼이 아니라, 실제 건물 안을 돌아다니는 듯한 인터랙티브한 UI를
                만들고 싶었습니다. 지하 1층부터 루프탑까지 총 6층짜리 공간을 상상하며 각 층의
                역할(바, 카페, 공연장 등)을 페이지화하려고 했습니다.
              </p>
            </div>

            <div>
              <p className="font-semibold">📐 계획했던 요소들</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>지하 1층 – 식당</li>
                <li>1층 – 메인 로비, 전시공간, 카페</li>
                <li>2~5층 – 푸드박스 , 공연장</li>
                <li>6층 – 루프탑 바</li>
                <li>페이지 내 건물 도면 이미지 & 층별 이동 UI</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">🚫 적용하지 못한 이유</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>
                  ⏱ <strong>시간 부족</strong> – 도면 구성 및 레이아웃 설계에 너무 많은 시간이
                  소요될 것으로 예상됨.
                </li>
                <li>
                  📸 <strong>이미지 자료 부족</strong> – 건물 도면이나 내부 구조 관련 이미지가
                  필요했으나, 직접 제작하거나 찾기 어려웠음.
                </li>
                <li>
                  🔁 <strong>우선순위 문제</strong> – 예약, 마이페이지, 상점 등 핵심 기능을 먼저
                  구현하기로 하면서 해당 기능은 보류하게 됨.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">💬 회고</p>
              <p>
                사용자의 몰입감을 높이기 위한 기획이었지만, 기술 리소스와 현실적인 마감일을 고려해
                과감하게 생략하게 된 기능입니다. 추후 프로젝트 리뉴얼 혹은 확장 시 도전해볼 수 있는
                가치 있는 아이디어라고 생각합니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Building;
