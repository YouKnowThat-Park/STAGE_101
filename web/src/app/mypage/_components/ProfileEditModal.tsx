import { getValidImageUrl } from '../../shop/_components/getValidImageUrl';
import { useUserStore } from '../../../store/userStore';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ProfileEditModalProps } from 'src/types/mypage/mypage-type';
import {
  useUpdateUserProfileData,
  useUpdateUserProfileImage,
} from 'src/hooks/user/useUpdateUserProfileImage';

const ProfileEditModal = ({ isOpen, onClose }: ProfileEditModalProps) => {
  const user = useUserStore();

  const [newNickname, setNewNickname] = useState<string>('');
  const [newProfileImg, setNewProfileImg] = useState<string>(user.profile_img ?? '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { mutateAsync: uploadProfileImage, isPending: isUploading } = useUpdateUserProfileImage();
  const { mutateAsync: updateUserProfile, isPending: isUpdating } = useUpdateUserProfileData();
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setNewNickname(user.nickname ?? '');
        setNewProfileImg(user.profile_img ?? '');
        setSelectedFile(null);
      }, 300);
    }
  }, [isOpen, user.nickname, user.profile_img]);

  // 파일이 변경되면 이미지 미리보기 생성
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setNewProfileImg(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (isSaving || isUploading || isUpdating) return;
    setIsSaving(true);

    try {
      let profileImageUrl = newProfileImg;

      // 1) 이미지 파일이 선택되어 있으면 → 업로드 + URL 반환 + React Query 캐시 업데이트
      if (selectedFile) {
        profileImageUrl = await uploadProfileImage(selectedFile);
        // 미리보기도 실제 URL로 교체
        setNewProfileImg(profileImageUrl);
      }

      // 2) 닉네임 정리
      const nicknameToSave = newNickname.trim() || user.nickname || '';

      // 3) 닉네임/프로필 정보 서버에 반영
      await updateUserProfile({
        nickname: nicknameToSave,
        profile_img: profileImageUrl,
      });

      // 4) Zustand 스토어도 동기화
      useUserStore.setState({
        ...user,
        nickname: nicknameToSave,
        profile_img: profileImageUrl,
      });

      setTimeout(() => onClose(), 300);
    } catch (error) {
      console.error('❌ 프로필 업데이트 오류:', error);
      alert('프로필 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const isDisabled =
    isSaving ||
    isUploading ||
    isUpdating ||
    (newNickname === (user.nickname ?? '') && newProfileImg === (user.profile_img ?? ''));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="
    relative w-[380px]
    rounded-xl
    bg-[#151515]
    border border-white/10
    p-6
    text-white
    shadow-[0_20px_60px_rgba(0,0,0,0.8)]
  "
      >
        {/* 헤더 */}
        <div className="mb-5">
          <h2 className="text-lg font-semibold">프로필 수정</h2>
          <p className="mt-1 text-sm text-white/50">닉네임과 프로필 이미지를 변경할 수 있습니다.</p>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition"
          aria-label="닫기"
        >
          ✕
        </button>

        {/* 닉네임 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-white/60">닉네임</label>
          <input
            type="text"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            className="
          w-full
          rounded-md
          border border-white/10
          bg-black/40
          px-3 py-2
          text-white
          placeholder:text-white/30
          focus:outline-none
          focus:border-[#C9A66B]
        "
          />
        </div>

        {/* 프로필 이미지 */}
        <div className="mt-4 flex flex-col gap-2">
          <label className="text-sm text-white/60">프로필 이미지</label>

          <label
            htmlFor="profile-upload"
            className="
      mx-auto
      flex flex-col items-center gap-2
      cursor-pointer
      group
    "
          >
            {/* 강조 텍스트 */}
            <span
              className="
        text-sm
        text-[#C9A66B]
        group-hover:text-[#E6C98A]
        transition
      "
            >
              이미지 변경
            </span>

            {/* 이미지 프리뷰 */}
            {newProfileImg && (
              <Image
                src={getValidImageUrl(newProfileImg)}
                alt="미리보기"
                width={96}
                height={96}
                className="
          h-24 w-24
          rounded-full
          object-cover
          ring-2 ring-white/10
          transition
          group-hover:ring-[#C9A66B]
          group-hover:opacity-90
        "
              />
            )}
          </label>

          {/* 실제 파일 input */}
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* 저장 버튼 */}
        <button
          onClick={handleSave}
          disabled={isDisabled}
          className="
        mt-6 w-full
        rounded-md
        bg-[#C9A66B]
        py-2
        text-sm font-semibold text-black
        hover:bg-[#E6C98A]
        transition
        disabled:cursor-not-allowed
        disabled:opacity-40
      "
        >
          {isUploading || isUpdating ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
};

export default ProfileEditModal;
