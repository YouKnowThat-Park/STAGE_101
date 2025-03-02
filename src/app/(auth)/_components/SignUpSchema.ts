import { z } from 'zod';
import { emailPasswordSchema } from './CommonSchemas';

export const signupSchema = emailPasswordSchema
  .extend({
    name: z
      .string()
      .min(2, { message: '이름은 최소 2자 이상이어야 합니다.' })
      .trim()
      .regex(/^[A-Za-z가-힣]+$/, { message: '이름에는 공백,숫자를 포함할 수 없습니다.' }),
    nickname: z.string().min(2, { message: '닉네임은 최소 2자 이상이어야 합니다.' }).trim(),
    phone: z
      .string()
      .length(11, '휴대폰 번호를 정확히 입력해주세요.')
      .regex(/^\d+$/, '숫자만 입력해주세요.'),
    birthdate: z
      .string()
      .length(6, '생년월일은 6자리YYMMDD)여야 합니다.')
      .regex(/^\d{6}$/, '생년월일은 숫자 6자리(YYMMDD) 형식이어야 합니다.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signupSchema>;
