'use client';

import { useState } from 'react';

const Calendar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white px-4">
      <div className="max-w-2xl mx-auto border border-gray-300 rounded-md shadow-md mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-6 py-4 bg-gray-100 hover:bg-gray-200 font-semibold text-lg transition flex justify-between items-center"
        >
          <span>📅 React Calendar 선택 이유</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </button>

        {isOpen && (
          <div className="px-6 py-5 bg-white space-y-4 text-gray-800 text-sm leading-relaxed">
            <h3 className="font-bold text-base">캘린더 기반 날짜 선택 UI</h3>

            <div>
              <p className="font-semibold">📌 선택 이유</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>예약 기능 구현을 위한 사용자 친화적인 날짜 선택 UI가 필요했음</li>
                <li>
                  React 컴포넌트로 쉽게 통합 가능하고, 최소한의 커스터마이징으로도 실용적인 UI 제공
                </li>
                <li>예약일, 관람일 등 날짜 기반 기능과 직관적으로 연동 가능</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">💬 회고</p>
              <p>
                React Calendar는 빠르게 예약/조회 UI를 완성하는 데 많은 도움이 되었고, 날짜 선택이
                필요한 페이지마다 재사용 가능하다는 점에서도 만족도가 높았습니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
