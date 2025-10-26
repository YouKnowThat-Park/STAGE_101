'use client';

import { useState } from 'react';

const Css = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white px-4">
      <div className="max-w-2xl mx-auto border border-gray-300 rounded-md shadow-md mb-6">
        {/* 드롭다운 토글 버튼 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-6 py-4 bg-gray-100 hover:bg-gray-200 font-semibold text-lg transition flex justify-between items-center"
        >
          <span>✅CSS 선택 이유 (Tailwind)</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </button>

        {/* 내용 */}
        {isOpen && (
          <div className="px-6 py-5 bg-white space-y-4 text-gray-800 text-sm leading-relaxed">
            <h3 className="font-bold text-base">Tailwind CSS 활용</h3>

            <div>
              <p className="font-semibold">📌 선택 이유</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>반응형 디자인을 빠르게 구축할 수 있음</li>
                <li>클래스 기반 스타일링으로 빠른 프로토타이핑 가능</li>
                <li>재사용 가능한 UI를 컴포넌트 수준에서 일관되게 관리</li>
                <li>개인 프로젝트에 적합한 간결한 스타일 구조</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">🛠 주요 사용 예시</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>모바일/데스크탑 반응형 레이아웃 구축</li>
                <li>버튼, 카드, 모달 등 공통 컴포넌트 스타일링</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">💬 회고</p>
              <p>
                디자인 시스템을 빠르게 구축할 수 있었고, 유지보수도 간편했습니다. 특히 컴포넌트와
                스타일을 한 곳에서 관리할 수 있어 개발 속도를 크게 향상시켰습니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Css;
