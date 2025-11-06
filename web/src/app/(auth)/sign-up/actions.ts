const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,32}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function signUp({
  email,
  password,
  name,
  phone,
  nickname,
}: {
  email: string;
  password: string;
  name: string;
  phone: string;
  nickname: string;
}) {
  try {
    if (!email || !password || !name || !phone || !nickname) {
      return { success: false, message: '모든 정보를 입력해주세요.' };
    }
    if (!PASSWORD_REGEX.test(password)) {
      return {
        success: false,
        message: '비밀번호는 대/소문자, 숫자, 특수문자가 모두 포함된 8자 이상이어야 합니다.',
      };
    }
    if (!EMAIL_REGEX.test(email)) {
      return { success: false, message: '이메일 형식이 올바르지 않습니다. 예시)stage@stage.com' };
    }
    if (name.length < 2) {
      return { success: false, message: '이름은 최소 2자리 이상이어야 합니다.' };
    }
    if (nickname.length < 2) {
      return { success: false, message: '닉네임은 최소 2자리 이상이어야 합니다.' };
    }

    const res = await fetch('http://localhost:8000/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, nickname, email, phone, password }),
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.detail || '회원가입 실패',
      };
    }

    return { success: true, message: `${name} 회원가입에 성공했습니다.`, user: data };
  } catch (error: any) {
    return { success: false, message: error.message || '회원가입 중 오류가 발생했습니다.' };
  }
}
