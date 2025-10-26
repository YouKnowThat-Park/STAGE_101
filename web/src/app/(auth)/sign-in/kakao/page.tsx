'use client';

const SocialLoginButtons = () => {
  const handleSocialSignIn = (provider: 'kakao' | 'google') => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/auth/${provider}`;
    document.body.appendChild(form);
    form.submit();
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
