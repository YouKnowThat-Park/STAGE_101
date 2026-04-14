'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { LoginModalProps } from 'src/types/auth/auth-type';

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-[101] w-full max-w-md overflow-hidden rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(8,8,8,0.98),rgba(18,18,18,0.96))] p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.72)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,166,107,0.12),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(120,180,255,0.06),transparent_35%)]" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] tracking-[0.28em] text-white/45">MEMBER ACCESS</p>
              <h2 className="mt-2 text-2xl font-bold text-white">로그인이 필요해요</h2>
            </div>

            <button
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              닫기
            </button>
          </div>

          <div className="mt-5 rounded-2xl bg-black/50 p-5 ring-1 ring-white/10">
            <p className="text-sm leading-7 text-white/78">
              이 기능은 로그인한 사용자만 사용할 수 있어요.
              <br />
              로그인 페이지로 이동해서 계속 진행해 주세요.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => router.push('/sign-in')}
              className="rounded-2xl bg-yellow-500 px-5 py-3 text-sm font-bold text-black shadow-lg shadow-yellow-500/20 transition hover:bg-yellow-400"
            >
              로그인하러 가기
            </button>
            <button
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/[0.08] px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/[0.12] hover:text-white"
            >
              나중에 할게요
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
