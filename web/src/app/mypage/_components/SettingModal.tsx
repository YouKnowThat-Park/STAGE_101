import { useDeleteUser } from 'src/hooks/user/useDeleteUser';
import { ModalProps } from '../../../types/modal/modal-type';
import React, { useState } from 'react';
import { useUserHook } from 'src/hooks/user/useUserHook';

const SettingModal = ({ isOpen, onClose }: ModalProps) => {
  const [checks, setChecks] = useState({ reservation: false, review: false, user: false });
  const [showErrors, setShowErrors] = useState(false);
  const [password, setPassword] = useState('');
  const [agreementText, setAgreementText] = useState('');

  const allChecked = Object.values(checks).every(Boolean);
  const { data: social } = useUserHook();
  const { mutate, isPending } = useDeleteUser();

  const isSocialUser = social?.phone === 'Kakao' || social?.phone === 'Google';

  const handleChange = (key: keyof typeof checks) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDeleteAccount = async () => {
    if (!allChecked) {
      setShowErrors(true);
      alert('필수 항목에 모두 동의해야 합니다.');
      return;
    }
    if (isSocialUser) {
      if (agreementText !== '동의합니다') {
        alert('"동의합니다"를 정확히 입력해 주세요.');
        return;
      }
    } else {
      if (!password) {
        alert('비밀번호를 입력해주세요.');
        return;
      }
    }
    const confirmDelete = confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    if (!confirmDelete) return;

    const payload = isSocialUser ? { agreement_text: agreementText.trim() } : { password };

    mutate(payload, {
      onSuccess: () => {
        alert('탈퇴 완료');
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
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="w-[400px]  max-w-lg bg-white rounded-lg shadow-lg p-6 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">회원 탈퇴</h2>

        <div className="space-y-4 mb-4">
          <label htmlFor="reservation" className="block cursor-pointer">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="reservation"
                checked={checks.reservation}
                onChange={() => handleChange('reservation')}
              />
              <span
                className={`font-medium ${!checks.reservation && showErrors ? 'text-red-500' : 'text-black'}`}
              >
                결제 내역 삭제 동의 (필수)
              </span>
            </div>
            <p className="text-sm">- 공연/상점(굿즈) 관련 결제 내역이 포함되어 있습니다.</p>
            <p className="text-sm">
              - 동의 시 모든 결제 내역 정보가 즉시 삭제되며 복구가 불가능합니다.
            </p>
          </label>

          <label htmlFor="review" className="block cursor-pointer">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="review"
                checked={checks.review}
                onChange={() => handleChange('review')}
              />
              <span
                className={`font-medium ${!checks.reservation && showErrors ? 'text-red-500' : 'text-black'}`}
              >
                리뷰 내역 삭제 동의 (필수)
              </span>
            </div>
            <p className="text-sm">- 모든 리뷰 내역 정보가 즉시 삭제되며 복구가 불가능합니다.</p>
          </label>

          <label htmlFor="user" className="block cursor-pointer">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="user"
                checked={checks.user}
                onChange={() => handleChange('user')}
              />
              <span
                className={`font-medium ${!checks.reservation && showErrors ? 'text-red-500' : 'text-black'}`}
              >
                유저 정보 삭제 동의 (필수)
              </span>
            </div>
            <p className="text-sm">- 모든 사용자 정보가 즉시 삭제되며 복구가 불가능합니다.</p>
            <p className="text-sm">
              - 같은 이메일로 바로 재가입 가능하지만 기존 정보는 복구가 불가능합니다.
            </p>
          </label>
        </div>
        {!isSocialUser ? (
          <>
            {/* 일반 회원: 비밀번호 입력 */}
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              탈퇴 확인을 위해 비밀번호를 입력해주세요
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="비밀번호 입력"
            />
          </>
        ) : (
          <>
            {/* 소셜 로그인 회원: 동의 문구 입력 */}
            <label htmlFor="agreement" className="block text-sm font-medium text-gray-700 mb-1">
              소셜 계정 탈퇴를 위해 <span className="font-semibold">"동의합니다"</span>를 정확히
              입력해주세요
            </label>
            <input
              type="text"
              id="agreement"
              value={agreementText}
              onChange={(e) => setAgreementText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="동의합니다"
            />
          </>
        )}

        <p className="text-gray-600 mb-6">
          회원 탈퇴를 진행하면 계정과 관련된 모든 데이터가 즉시 삭제됩니다. 이 작업은 되돌릴 수
          없습니다.
        </p>

        <button
          className="w-full mb-4 py-2 px-4 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none"
          onClick={handleDeleteAccount}
          disabled={isPending}
        >
          {isPending ? '탈퇴 중...' : '회원 탈퇴'}
        </button>

        <button
          className="w-full py-2 px-4 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none"
          onClick={onClose}
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default SettingModal;
