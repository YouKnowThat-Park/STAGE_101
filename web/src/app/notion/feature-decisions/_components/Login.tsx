'use client';

import { useState } from 'react';

const Login = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white px-4">
      <div className="max-w-2xl mx-auto border border-gray-300 rounded-md shadow-md mb-6">
        {/* 드롭다운 토글 버튼 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-6 py-4 bg-gray-100 hover:bg-gray-200 font-semibold text-lg transition flex justify-between items-center"
        >
          <span>🔐 소셜 로그인 선택 이유 (Kakao , Google)</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </button>

        {/* 내용 */}
        {isOpen && (
          <div className="px-6 py-5 bg-white space-y-4 text-gray-800 text-sm leading-relaxed">
            <h3 className="font-bold text-base">1. 소셜 로그인 적용 배경</h3>

            <div>
              <p className="font-semibold">📌 기획 의도</p>
              <p>
                사용자 접근성을 높이고, 로그인 진입 장벽을 낮추기 위해 소셜 로그인을 도입했습니다.
                별도의 회원가입 절차 없이 손쉽게 로그인할 수 있는 점을 고려했습니다.
              </p>
            </div>

            <div>
              <p className="font-semibold">🔑 선택한 소셜 로그인 방식</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>
                  <strong>카카오 로그인</strong> – 국내에서 가장 많이 사용되는 소셜 플랫폼. 특히
                  한국 사용자에게 친숙하고 접근성이 높습니다.
                </li>
                <li>
                  <strong>구글 로그인</strong> – 글로벌 사용자에게 보편적인 로그인 방식으로 신뢰도와
                  사용성이 뛰어납니다.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">🛠 Supabase 인증 관련</p>
              <p>
                Supabase 인증 로직 및 보안 이슈, 유저 스토어 구성 등은 별도의 섹션에서 자세히
                설명하고 있기 때문에 이 페이지에서는 생략합니다.
              </p>
            </div>

            <div>
              <p className="font-semibold">💬 회고</p>
              <p>
                소셜 로그인 도입은 사용자 접근성을 높이기 위한 전략적 선택이었고, 실제로 구현 과정도
                Supabase Auth와 쉽게 연동되어 개발 효율도 높았습니다. 테스트를 통한 사용자 피드백은
                없지만, 국내/글로벌 UX 트렌드를 반영한 결정으로 판단됩니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
