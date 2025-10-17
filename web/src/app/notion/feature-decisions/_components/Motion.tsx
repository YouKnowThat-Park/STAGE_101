'use client';

import { useState } from 'react';

const Motion = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white px-4">
      <div className="max-w-2xl mx-auto border border-gray-300 rounded-md shadow-md mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-6 py-4 bg-gray-100 hover:bg-gray-200 font-semibold text-lg transition flex justify-between items-center"
        >
          <span>🎞️ Framer Motion 선택 이유</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </button>

        {isOpen && (
          <div className="px-6 py-5 bg-white space-y-4 text-gray-800 text-sm leading-relaxed">
            <h3 className="font-bold text-base">인터랙션 애니메이션 적용</h3>

            <div>
              <p className="font-semibold">📌 선택 이유</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>모달, 페이지 전환 등 사용자 경험을 향상시키기 위한 애니메이션 필요</li>
                <li>Next.js와의 호환성이 좋고 직관적인 API 제공</li>
                <li>반응형 환경에서도 자연스럽고 부드러운 UX 제공</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">💬 회고</p>
              <p>
                프로젝트 전반에 생동감을 더해준 라이브러리로, 리뷰 모달/작성 전환 등 사용자 흐름에
                시각적인 피드백을 제공해 만족스러운 결과를 얻었습니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Motion;
