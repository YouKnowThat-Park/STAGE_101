'use client';

import GoogleLogin from '@/ui/icon/GoogleLogin';
import KakaoLogin from '@/ui/icon/KakaoLogin';
import QrLogin from '@/ui/icon/QrLogin';
import { useRouter } from 'next/navigation';
import React from 'react';

const page = () => {
  const router = useRouter();
  const handleSignUpPage = () => {
    router.push('/sign-up');
  };

  return (
    <>
      <div className="flex gap-4 justify-center items-center h-screen">
        <div className="w-[450px] h-96 bg-slate-400 flex flex-col gap-1 p-4">
          <label htmlFor="email">이메일</label>
          <input type="text" id="email" className="bg-green-300 p-2 rounded" />

          <label htmlFor="password">비밀번호</label>
          <input type="password" id="password" className="p-2 border border-gray-300 rounded" />

          <div className="flex justify-center items-center mt-2">
            <div className="flex gap-2">
              <input type="checkbox" id="checkbox" />
              <label htmlFor="checkbox" className="text-sm">
                이메일 저장
              </label>
            </div>
            <p className="ml-48 text-sm">이메일/비밀번호 찾기</p>
          </div>

          {/* 소설 로그인 */}
          <div className="flex justify-center items-center gap-10 mt-9">
            <KakaoLogin />
            <GoogleLogin />
            <QrLogin />
          </div>

          {/* 로그인 버튼 */}
          <div className="flex justify-center items-center mt-9">
            <button className="bg-gray-500 h-10 w-48">로그인</button>
            <button onClick={handleSignUpPage}>회원가입</button>
          </div>
        </div>

        {/* 오른쪽 사진 박스 */}
        <div className="w-80 h-96 bg-white"></div>
      </div>
    </>
  );
};

export default page;
