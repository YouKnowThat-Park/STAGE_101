'use client';

import { socialLogin } from './actions'; // ✅ 서버 액션 임포트

const KakaoLoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={() => socialLogin('kakao')}
        className="bg-yellow-400 px-4 py-2 rounded-md shadow-md text-black"
      >
        카카오 로그인
      </button>
      <button
        onClick={() => socialLogin('google')}
        className="bg-blue-500 px-4 py-2 rounded-md shadow-md text-white"
      >
        구글 로그인
      </button>
    </div>
  );
};

export default KakaoLoginPage;
