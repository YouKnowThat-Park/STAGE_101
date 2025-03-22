import { z } from 'zod';
import { emailPasswordSchema } from './CommonSchemas';

export const signupSchema = emailPasswordSchema
  .extend({
    name: z
      .string()
      .nonempty({ message: '이름을 입력해주세요.' })
      .min(2, { message: '이름은 최소 2자 이상이어야 합니다.' })
      .trim()
      .regex(/^[A-Za-z가-힣]+$/, {
        message: '이름에는 공백, 숫자를 포함할 수 없습니다.',
      }),

    nickname: z
      .string()
      .nonempty({ message: '닉네임을 입력해주세요.' })
      .min(2, { message: '닉네임은 최소 2자 이상이어야 합니다.' })
      .trim(),

    phone: z
      .string()
      .nonempty({ message: '휴대폰 번호를 입력해주세요.' })
      .length(11, { message: '휴대폰 번호는 11자리여야 합니다.' })
      .regex(/^\d+$/, { message: '숫자만 입력해주세요.' }),

    birthdate: z
      .string()
      .nonempty({ message: '생년월일을 입력해주세요.' })
      .length(6, { message: '생년월일은 6자리(YYMMDD)여야 합니다.' })
      .regex(/^\d{6}$/, {
        message: '생년월일은 숫자 6자리(YYMMDD) 형식이어야 합니다.',
      }),

    confirmPassword: z.string().nonempty({ message: '비밀번호를 다시 입력해주세요.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signupSchema>;
