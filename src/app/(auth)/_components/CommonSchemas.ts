import { z } from 'zod';

export const emailPasswordSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요.').trim(),
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자리 이상이어야 합니다.')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,32}$/,
      '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
    ),
});

export type EmailPasswordFormData = z.infer<typeof emailPasswordSchema>;
