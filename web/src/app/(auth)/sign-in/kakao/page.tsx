'use client';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

const SocialLoginButtons = () => {
  const handleSocialSignIn = (provider: 'kakao' | 'google') => {
    // FastAPI 소셜 로그인 엔드포인트로 바로 이동
    window.location.href = `${API_BASE}/users/social/${provider}/signin`;
  };

  return (
    <div className="flex gap-4 justify-center">
      <button
        onClick={() => handleSocialSignIn('kakao')}
        className="bg-yellow-400 px-4 py-2 rounded-md shadow-md text-black"
      >
        카카오 로그인
      </button>
      <button
        onClick={() => handleSocialSignIn('google')}
        className="bg-blue-500 px-4 py-2 rounded-md shadow-md text-white"
      >
        구글 로그인
      </button>
    </div>
  );
};

export default SocialLoginButtons;
