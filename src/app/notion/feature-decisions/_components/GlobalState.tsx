'use client';

import { useState } from 'react';

const GlobalState = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white px-4">
      <div className="max-w-2xl mx-auto border border-gray-300 rounded-md shadow-md mb-6">
        {/* 드롭다운 토글 버튼 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-6 py-4 bg-gray-100 hover:bg-gray-200 font-semibold text-lg transition flex justify-between items-center"
        >
          <span>✅ 전역 상태 관리 (Zustand)</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </button>

        {/* 내용 */}
        {isOpen && (
          <div className="px-6 py-5 bg-white space-y-4 text-gray-800 text-sm leading-relaxed">
            <h3 className="font-bold text-base">Zustand 도입 배경</h3>

            <div>
              <p className="font-semibold">📌 선택 이유</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Redux보다 가볍고 설정이 단순해 빠른 도입 가능</li>
                <li>보일러플레이트 없이 간결하게 전역 상태 관리</li>
                <li>서버 상태와 UI 상태를 명확히 분리해서 사용</li>
                <li>모듈 단위로 store를 쪼개 관리하기 편리함</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">⚙️ 주요 사용 예시</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>로그인한 사용자 정보 저장</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">💬 회고</p>
              <p>
                Zustand는 React 앱에서 간단한 전역 상태가 필요한 경우 매우 이상적인 도구였습니다.
                학습 곡선이 낮아 빠르게 적용할 수 있었고, 불필요한 코드 없이 직관적으로 상태를
                설계할 수 있어 개발 효율성이 높았습니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalState;
