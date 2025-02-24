import { z } from 'zod';

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, { message: '이름은 최소 2자 이상이어야 합니다.' })
    .trim()
    .regex(/^[A-Za-z가-힣]+$/, { message: '이름에는 공백,숫자를 포함할 수 없습니다.' }),
  nickname: z
    .string()
    .min(2, { message: '닉네임은 최소 2자 이상이어야 합니다.' })
    .trim()
    .regex(/^[A-Za-z가-힣]+$/, { message: '닉네임에는 숫자를 포함할 수 없습니다.' }),
  phone: z
    .string()
    .length(11, '휴대폰 번호를 정확히 입력해주세요.')
    .regex(/^\d+$/, '숫자만 입력해주세요.'),
});

export type SignUpFormData = z.infer<typeof signupSchema>;
