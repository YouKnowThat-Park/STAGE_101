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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
        <h2 className="text-xl font-bold mb-4">프로필 수정</h2>

        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
          ✕
        </button>

        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-medium">닉네임</label>
          <input
            type="text"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>

        <div className="flex flex-col gap-2 mt-3">
          <label className="text-gray-700 font-medium">프로필 이미지</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
          {newProfileImg && (
            <>
              {/* 🔍 이미지 URL 출력 */}
              <Image
                src={getValidImageUrl(newProfileImg)}
                alt="미리보기"
                height={100}
                width={100}
                className="w-24 h-24 object-cover rounded-full mx-auto mt-2"
              />
            </>
          )}
        </div>

        <button
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          onClick={handleSave}
          disabled={isDisabled}
        >
          {isUploading || isUpdating ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
};

export default ProfileEditModal;
