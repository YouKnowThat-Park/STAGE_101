import React from 'react';

const TermsOfService = () => {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 text-white">
      <h1 className="text-2xl font-semibold">이용약관 (포트폴리오/데모)</h1>
      <p className="mt-2 text-sm text-white/70">작성일: 2026-01-19</p>

      {/* ✅ Portfolio Disclaimer */}
      <div className="mt-6 rounded-2xl border border-[#C9A66B]/30 bg-[#0E0E0E] p-5">
        <p className="text-sm leading-relaxed text-white/85">
          <span className="text-[#C9A66B] font-semibold">[중요 안내]</span> 본 서비스(STAGE101)는{' '}
          <span className="text-white font-medium">
            개인 포트폴리오 용도로 제작된 데모 프로젝트
          </span>
          입니다.
          <br />
          실제 사업체/운영사가 아닌 <span className="text-white font-medium">가상의 서비스</span>
          이며, 실제 상업적 목적의 판매·중개·결제 서비스가 아닙니다.
          <br />
          또한, 제작자가 취업(입사) 등의 사유로 프로젝트 운영을 지속하기 어려운 경우{' '}
          <span className="text-white font-medium">서비스는 예고 없이 중단될 수 있습니다</span>.
        </p>
      </div>

      <div className="mt-10 space-y-8 leading-relaxed text-white/85">
        <article className="space-y-3">
          <h2 className="text-lg font-semibold text-white">제1조 (목적)</h2>
          <p>
            본 약관은 포트폴리오 데모 프로젝트 “STAGE101”(이하 “서비스”)의 이용과 관련된 기본 사항을
            안내하기 위한 문서입니다.
          </p>
        </article>

        <article className="space-y-3">
          <h2 className="text-lg font-semibold text-white">제2조 (서비스 성격 및 제공 범위)</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>서비스는 UI/UX 및 기능 시연을 위한 데모 환경입니다.</li>
            <li>
              일부 기능은 실제 서비스처럼 보일 수 있으나, 상업적 운영을 위한 서비스가 아닙니다.
            </li>
            <li>서비스 구성/화면/기능은 예고 없이 변경되거나 중단될 수 있습니다.</li>
          </ul>
        </article>

        <article className="space-y-3">
          <h2 className="text-lg font-semibold text-white">제3조 (테스트 결제/예매 안내)</h2>
          <p>
            결제/예매 화면은 <span className="text-white font-medium">흐름 시연 목적</span>으로
            제공될 수 있습니다. 결제 UI가 실제와 유사하더라도{' '}
            <span className="text-[#C9A66B] font-medium">
              실제 금전 결제 또는 실제 예매가 발생하지 않습니다
            </span>
            . 이용자는 이를 이해하고 데모 목적으로만 이용합니다.
          </p>
        </article>

        <article className="space-y-3">
          <h2 className="text-lg font-semibold text-white">제4조 (이용자의 준수사항)</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              서비스의 정상적인 동작을 방해하는 행위(과도한 요청, 비정상 접근 등)를 금지합니다.
            </li>
            <li>타인의 권리를 침해하거나 불쾌감을 주는 내용의 입력/게시를 금지합니다.</li>
            <li>서비스를 악의적으로 테스트(침투/해킹 시도 등)하는 행위를 금지합니다.</li>
          </ul>
        </article>

        <article className="space-y-3">
          <h2 className="text-lg font-semibold text-white">제5조 (콘텐츠 및 저작권 고지)</h2>
          <p>
            서비스에 사용된 이미지/사진/그래픽은{' '}
            <span className="text-white font-medium">AI 툴로 생성된 자료</span> 또는{' '}
            <span className="text-white font-medium">제작자가 제작·촬영한 자료</span>일 수 있습니다.
            모든 자료는 데모 시연 목적이며, 무단 복제·배포를 금지합니다.
          </p>
        </article>

        <article className="space-y-3">
          <h2 className="text-lg font-semibold text-white">제6조 (면책)</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>본 서비스는 데모이므로, 기능의 완전성·지속성을 보장하지 않습니다.</li>
            <li>서비스 이용 과정에서 발생한 데이터 손실, 오류 등에 대해 책임을 지지 않습니다.</li>
            <li>이 문서는 법률 자문이 아니며, 실서비스 약관과 동일한 효력을 보장하지 않습니다.</li>
          </ul>
        </article>

        <article className="space-y-3">
          <h2 className="text-lg font-semibold text-white">부칙</h2>
          <p>본 약관은 게시일(2026-01-19)부터 적용됩니다.</p>
        </article>
      </div>
    </section>
  );
};

export default TermsOfService;
