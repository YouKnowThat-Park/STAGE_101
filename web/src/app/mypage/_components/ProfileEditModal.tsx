import { getValidImageUrl } from '../../shop/_components/getValidImageUrl';
import { useUserStore } from '../../../store/userStore';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ProfileEditModalProps } from 'src/types/mypage/mypage-type';
import { updateUserProfileImage } from 'src/lib/api/user/updateUserProfileImage';

const ProfileEditModal = ({ isOpen, onClose }: ProfileEditModalProps) => {
  const user = useUserStore();

  const [newNickname, setNewNickname] = useState<string>('');
  const [newProfileImg, setNewProfileImg] = useState<string>(user.profile_img ?? '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    if (isLoading) return;
    setIsLoading(true);

    try {
      let profileImageUrl = newProfileImg;

      if (selectedFile) {
        profileImageUrl = await updateUserProfileImage(selectedFile);
      }

      const nicknameToSave = newNickname.trim() || user.nickname || '';

      const res = await fetch('http://localhost:8000/users/me/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nickname: newNickname,
          profile_img: profileImageUrl,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || '서버 오류 발생');
      }

      useUserStore.setState({
        ...user,
        nickname: nicknameToSave,
        profile_img: profileImageUrl,
      });

      setTimeout(() => onClose(), 300);
    } catch (error) {
      console.error('❌ 프로필 업데이트 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled =
    isLoading ||
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
          {isLoading ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
};

export default ProfileEditModal;
