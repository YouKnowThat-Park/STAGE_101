'use server';

import { serverSupabase } from '@/supabase/supabase-server';

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
    const supabase = await serverSupabase();

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

    const { data: existingEmail } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingEmail) {
      return { success: false, message: '이미 사용 중인 이메일입니다.' };
    }

    const { data: existingPhone } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .single();

    if (existingPhone) {
      return { success: false, message: '이미 등록된 휴대폰 번호입니다.' };
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) return { success: false, message: '회원가입 실패: ' + authError.message };

    const userId = authData.user?.id;
    if (!userId) {
      return { success: false, message: '서버 오류: 사용자 ID 생성 실패' };
    }

    const { error: upsertError } = await supabase.from('users').upsert(
      {
        id: userId,
        email,
        phone,
        name,
        nickname,
      },
      { onConflict: 'id' },
    );

    if (upsertError) {
      return { success: false, message: '추가 정보 저장 실패: ' + upsertError.message };
    }

    return { success: true, message: `${name} 회원가입에 성공했습니다.` };
  } catch (error: any) {
    return { success: false, message: error.message || '회원가입 중 오류가 발생했습니다.' };
  }
}
