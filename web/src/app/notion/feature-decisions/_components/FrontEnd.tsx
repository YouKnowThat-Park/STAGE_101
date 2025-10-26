'use client';

import { useState } from 'react';

const FrontEnd = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white px-4">
      <div className="max-w-2xl mx-auto border border-gray-300 rounded-md shadow-md mb-6">
        {/* 드롭다운 토글 버튼 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-6 py-4 bg-gray-100 hover:bg-gray-200 font-semibold text-lg transition flex justify-between items-center"
        >
          <span>✅ 프론트엔드 기술 스택 선택 이유 (Tanstack Query , TypeScript)</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </button>

        {/* 내용 */}
        {isOpen && (
          <div className="px-6 py-5 bg-white space-y-4 text-gray-800 text-sm leading-relaxed">
            <h3 className="font-bold text-base">Next.js / React / TypeScript</h3>

            <div>
              <p className="font-semibold">📌 선택 이유</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>
                  <strong>Next.js</strong> – SEO 최적화와 빠른 페이지 렌더링으로 퍼포먼스를
                  개선하고, App Router를 통해 생산성을 향상시키기 위해 도입
                </li>
                <li>
                  <strong>React</strong> – 컴포넌트 기반 구조를 활용하여 재사용성과 유지보수성을
                  확보
                </li>
                <li>
                  <strong>TypeScript</strong> – 정적 타입 검사로 코드 안정성 향상 및 IDE 지원 강화
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">⚙️ 주요 활용 방식</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>App Router + Server Action 기반 폴더 구조 설계</li>
                <li>전역 상태 관리를 위한 Zustand 사용</li>
                <li>사용자 경험을 위한 framer-motion, react-query 등 통합 활용</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">💬 회고</p>
              <p>
                Next.js와 React는 현재 프론트엔드 개발에서 가장 강력한 조합이라 생각합니다. 특히 App
                Router와 Server Component 기능은 프로젝트 구조를 체계화하는 데 큰 도움이 되었고,
                타입 안정성 덕분에 유지보수에서도 안정감을 느낄 수 있었습니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FrontEnd;
