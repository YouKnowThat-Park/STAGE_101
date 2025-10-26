'use client';

import { useState } from 'react';

const ServerState = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white px-4">
      <div className="max-w-2xl mx-auto border border-gray-300 rounded-md shadow-md mb-6">
        {/* 드롭다운 토글 버튼 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-6 py-4 bg-gray-100 hover:bg-gray-200 font-semibold text-lg transition flex justify-between items-center"
        >
          <span>✅ 서버 상태 관리 선택 이유 (React Query)</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </button>

        {/* 내용 */}
        {isOpen && (
          <div className="px-6 py-5 bg-white space-y-4 text-gray-800 text-sm leading-relaxed">
            <h3 className="font-bold text-base">TanStack Query 도입 배경</h3>

            <div>
              <p className="font-semibold">📌 선택 이유</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>비동기 API 요청 상태를 효율적으로 관리 가능</li>
                <li>자동 캐싱 및 데이터 갱신 처리로 성능 최적화</li>
                <li>서버 상태와 클라이언트 상태 분리하여 관리</li>
                <li>코드량 감소와 유지보수성 증가</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">⚙️ 주요 활용 기능</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>리뷰 목록 무한 스크롤 (useInfiniteQuery)</li>
                <li>장바구니, 예매 내역 등 데이터 캐싱</li>
                <li>변경 발생 시 자동 리페치</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">💬 회고</p>
              <p>
                TanStack Query는 프로젝트 전반에 걸쳐 서버 데이터를 관리하는 데 핵심적인 역할을
                했습니다. 캐싱 전략과 리패치 기능 덕분에 사용자 경험과 성능 모두 만족스러운 결과를
                얻었고, 특히 복잡한 상태 로직 없이도 직관적으로 API를 제어할 수 있었습니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerState;
