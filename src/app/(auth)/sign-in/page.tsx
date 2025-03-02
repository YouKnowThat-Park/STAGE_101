import React from 'react';

const page = () => {
  return (
    <div className="flex gap-4 justify-center items-center h-screen">
      {/* 왼쪽 로그인 박스  */}
      <div className="w-[450px] h-96 bg-slate-400 flex flex-col gap-1 p-4">
        <label htmlFor="">이메일</label>
        <input type="text" className="bg-green-300 p-2 rounded" />

        <label htmlFor="">비밀번호</label>
        <input type="password" className="p-2 border border-gray-300 rounded" />

        <input type="checkbox" />
        <label htmlFor="">아이디 저장</label>
      </div>
      {/* 오른쪽 사진 박스 */}
      <div className="w-80 h-96 bg-orange-200"></div>
    </div>
  );
};

export default page;
