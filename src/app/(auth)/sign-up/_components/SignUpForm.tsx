import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpFormData, signupSchema } from '../../_components/SignUpSchema';
import AuthInputField from '../../_components/AuthInputField';

const inputFields: { label: string; type: string; name: keyof SignUpFormData }[] = [
  { label: '이메일', type: 'email', name: 'email' },
  { label: '이름', type: 'text', name: 'name' },
  { label: '닉네임', type: 'text', name: 'nickname' },
  { label: '비밀번호', type: 'password', name: 'password' },
  { label: '비밀번호 확인', type: 'password', name: 'confirmPassword' },
  { label: '휴대폰번호', type: 'text', name: 'phone' },
  { label: '생년월일', type: 'text', name: 'birthdate' },
];

interface SignUpFormProps {
  onSubmit: (data: SignUpFormData) => void;
}

const SignUpForm = ({ onSubmit }: SignUpFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {inputFields.map((field) => (
        <Controller
          key={field.name}
          name={field.name}
          control={control}
          render={({ field: { value, onChange, ref }, fieldState }) => (
            <>
              <AuthInputField
                label={field.label}
                type={field.type}
                value={value}
                onChange={onChange}
                ref={ref}
              />
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
              )}
            </>
          )}
        />
      ))}
      <button type="submit">회원가입</button>
    </form>
  );
};

export default SignUpForm;
