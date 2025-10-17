'use client';

import { useState } from 'react';

const BackEnd = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white px-4">
      <div className="max-w-2xl mx-auto border border-gray-300 rounded-md shadow-md mb-6">
        {/* 드롭다운 토글 버튼 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-6 py-4 bg-gray-100 hover:bg-gray-200 font-semibold text-lg transition flex justify-between items-center"
        >
          <span>✅ 백엔드 (Supabase) 선택 이유</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </button>

        {/* 내용 */}
        {isOpen && (
          <div className="px-6 py-5 bg-white space-y-4 text-gray-800 text-sm leading-relaxed">
            <h3 className="font-bold text-base">Supabase 기반 백엔드 설계</h3>

            <div>
              <p className="font-semibold">📌 선택 이유</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>프론트엔드 기반 풀스택 프로젝트로, 백엔드 개발자 없이도 빠르게 구현 가능</li>
                <li>인증, 데이터베이스, 스토리지 등 핵심 기능을 통합적으로 제공</li>
                <li>SQL 기반 커스터마이징으로 프론트에서 부족한 로직을 보완 가능</li>
                <li>Row Level Security, 트리거, 함수 등 확장성이 뛰어남</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">⚙️ 주요 활용 기능</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>소셜 로그인 (Google, Kakao) 연동</li>
                <li>PostgreSQL 기반 DB 테이블 설계</li>
                <li>트리거, 함수, RLS 정책 활용</li>
                <li>이미지 업로드용 스토리지</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">💬 회고</p>
              <p>
                Supabase는 프론트엔드 개발자에게 매우 강력한 백엔드 도구였고, 로그인부터 결제 내역
                관리, 리뷰 작성까지 다양한 기능을 간결하게 구현할 수 있었습니다. 프로젝트 규모가
                커져도 확장이 가능하다는 점에서 추후 리뉴얼 시에도 충분히 활용할 수 있는 솔루션이라
                생각합니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackEnd;
