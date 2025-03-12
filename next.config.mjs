/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'zxryfhnxexxyxmrctocl.supabase.co', // ✅ Supabase 이미지 도메인
      'k.kakaocdn.net', // ✅ 카카오 프로필 이미지 도메인 추가
      'lh3.googleusercontent.com', // ✅ Google 프로필 이미지 도메인 추가
    ],
  },
};

export default nextConfig;
