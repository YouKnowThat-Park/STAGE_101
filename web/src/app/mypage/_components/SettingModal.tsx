'use client';

import React, { useState } from 'react';
import { useDeleteUser } from 'src/hooks/user/useDeleteUser';
import { useUserHook } from 'src/hooks/user/useUserHook';
import { ModalProps } from '../../../types/modal/modal-type';

const SettingModal = ({ isOpen, onClose }: ModalProps) => {
  const [checks, setChecks] = useState({
    reservation: false,
    review: false,
    user: false,
  });
  const [showErrors, setShowErrors] = useState(false);
  const [password, setPassword] = useState('');
  const [agreementText, setAgreementText] = useState('');

  const { data: social } = useUserHook();
  const { mutate, isPending } = useDeleteUser();

  const isSocialUser = social?.phone === 'Kakao' || social?.phone === 'Google';
  const allChecked = Object.values(checks).every(Boolean);

  const handleChange = (key: keyof typeof checks) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDeleteAccount = () => {
    if (!allChecked) {
      setShowErrors(true);
      alert('필수 항목에 모두 동의해야 합니다.');
      return;
    }

    if (isSocialUser) {
      if (agreementText.trim() !== '동의합니다') {
        alert('"동의합니다"를 정확히 입력해 주세요.');
        return;
      }
    } else {
      if (!password) {
        alert('비밀번호를 입력해주세요.');
        return;
      }
    }

    const confirmDelete = confirm('정말 탈퇴하시겠습니까?\n이 작업은 되돌릴 수 없습니다.');
    if (!confirmDelete) return;

    const payload = isSocialUser ? { agreement_text: agreementText.trim() } : { password };

    mutate(payload, {
      onSuccess: () => {
        alert('탈퇴가 완료되었습니다.');
        window.location.href = '/';
      },
      onError: (err: Error) => {
        alert(err.message);
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="
          relative w-[420px] max-w-[90vw]
          rounded-xl bg-[#151515]
          border border-white/10
          p-6 text-white
          shadow-[0_30px_80px_rgba(0,0,0,0.85)]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="mb-5">
          <p className="text-xs tracking-[0.3em] text-white/40">STAGE101 • ACCOUNT</p>
          <h2 className="mt-1 text-lg font-semibold text-red-400">회원 탈퇴</h2>
          <p className="mt-2 text-sm text-white/60 leading-relaxed">
            회원 탈퇴 시 계정과 관련된 모든 데이터는 즉시 삭제되며, 이 작업은 되돌릴 수 없습니다.
          </p>
        </div>

        {/* 동의 체크 */}
        <div className="space-y-4 text-sm">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checks.reservation}
              onChange={() => handleChange('reservation')}
              className="mt-1 accent-red-500"
            />
            <span className={!checks.reservation && showErrors ? 'text-red-400' : 'text-white/80'}>
              결제 내역 삭제 동의 (필수)
              <p className="mt-1 text-xs text-white/50">
                공연 및 상점(굿즈) 관련 결제 내역이 모두 삭제되며 복구할 수 없습니다.
              </p>
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checks.review}
              onChange={() => handleChange('review')}
              className="mt-1 accent-red-500"
            />
            <span className={!checks.review && showErrors ? 'text-red-400' : 'text-white/80'}>
              리뷰 내역 삭제 동의 (필수)
              <p className="mt-1 text-xs text-white/50">
                작성한 모든 리뷰 정보가 즉시 삭제되며 복구가 불가능합니다.
              </p>
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checks.user}
              onChange={() => handleChange('user')}
              className="mt-1 accent-red-500"
            />
            <span className={!checks.user && showErrors ? 'text-red-400' : 'text-white/80'}>
              유저 정보 삭제 동의 (필수)
              <p className="mt-1 text-xs text-white/50">
                탈퇴 시 본 서비스에 저장된 모든 사용자 정보는 즉시 삭제되며 복구할 수 없습니다.
              </p>
              <p className="mt-1 text-xs text-white/50">
                소셜 로그인(Kakao, Google) 사용자는 서비스 탈퇴와 별개로, 각 소셜 플랫폼에서 계정
                연결 해제를 직접 진행해야 합니다.
              </p>
            </span>
          </label>
        </div>

        {/* 추가 확인 */}
        <div className="mt-5">
          {!isSocialUser ? (
            <>
              <label className="block text-xs text-white/60 mb-1">
                탈퇴 확인을 위해 비밀번호를 입력해주세요
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full rounded-md
                  border border-white/10
                  bg-black/40
                  px-3 py-2
                  text-white
                  placeholder:text-white/30
                  focus:outline-none
                  focus:border-red-400
                "
                placeholder="비밀번호 입력"
              />
            </>
          ) : (
            <>
              <label className="block text-xs text-white/60 mb-1">
                <span className="font-semibold text-white">"동의합니다"</span> 를 정확히
                입력해주세요
              </label>
              <input
                type="text"
                value={agreementText}
                onChange={(e) => setAgreementText(e.target.value)}
                className="
                  w-full rounded-md
                  border border-white/10
                  bg-black/40
                  px-3 py-2
                  text-white
                  placeholder:text-white/30
                  focus:outline-none
                  focus:border-red-400
                "
                placeholder="동의합니다"
              />
            </>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleDeleteAccount}
            disabled={isPending}
            className="
              w-full rounded-md
              bg-red-500/90
              py-2
              text-sm font-semibold
              hover:bg-red-600
              transition
              disabled:opacity-40
            "
          >
            {isPending ? '탈퇴 처리 중...' : '회원 탈퇴'}
          </button>

          <button
            onClick={onClose}
            className="
              w-full rounded-md
              border border-white/10
              py-2
              text-sm text-white/70
              hover:bg-white/5
              transition
            "
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingModal;
