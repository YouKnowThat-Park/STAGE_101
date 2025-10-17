'use client';

import { useState } from 'react';

const ZodValidationIssue = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white px-4">
      <div className="max-w-2xl mx-auto border border-gray-300 rounded-md shadow-md mb-6">
        {/* 드롭다운 토글 버튼 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-6 py-4 bg-gray-100 hover:bg-gray-200 font-semibold text-lg transition flex justify-between items-center"
        >
          <span>✅ Zod 유효성 검사 시 .nonempty() 누락 문제</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </button>

        {isOpen && (
          <div className="px-6 py-5 bg-white space-y-4 text-gray-800 text-sm leading-relaxed">
            <h3 className="font-bold text-base">🎯 문제 상황</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                <code>Zod</code>로 폼 검증 중, 빈 문자열 입력 시 <strong>{`"Required"`}</strong>
                기본 메시지만 출력됨
              </li>
              <li>{`커스텀 메시지(예: "이름을 입력해주세요.")가 나오지 않음`}</li>
              <li>
                <code>min</code> / <code>regex</code>만 적용했을 경우, 빈 값은 검증 대상조차 되지
                않음
              </li>
            </ul>

            <h3 className="font-bold text-base">🔍 원인 분석</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                Zod의 <code>string()</code>은 기본적으로 빈 문자열도 유효한 값으로 간주함
              </li>
              <li>
                <code>.nonempty()</code>를 명시하지 않으면, 이후의 <code>min()</code>이나
                <code>regex()</code>는 무시됨
              </li>
              <li>결과적으로 빈 문자열에 대한 커스텀 메시지가 출력되지 않음</li>
            </ul>

            <h3 className="font-bold text-base">💡 해결 방법</h3>
            <p>
              각 필드에 <code>.nonempty({`{ message: '입력해주세요.' }`})</code>를 먼저 설정 필요
            </p>

            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">{`
nickname: z
  .string()
  .nonempty({ message: '닉네임을 입력해주세요.' }) // ✅ 필수
  .min(2, { message: '닉네임은 최소 2자 이상이어야 합니다.' })
  .trim()
            `}</pre>

            <h3 className="font-bold text-base">📌 결과</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>빈 입력 시에도 커스텀 메시지 출력됨</li>
              <li>
                <code>nonempty</code> → <code>min</code> → <code>regex</code> 순서대로 검증 적용됨
              </li>
              <li>사용자에게 명확한 피드백 제공 가능</li>
            </ul>

            <h3 className="font-bold text-base">💬 회고</h3>
            <p>
              {` Zod의 기본 동작을 이해하는 것이 중요했고, 빈 문자열도 "유효한 문자열"로 판단한다는
              점이 함정이었다. 필수 입력값엔 반드시 `}
              <code>nonempty()</code>를 명시해줄 것.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZodValidationIssue;
