import React, { useEffect } from 'react';
import AuthInputField from '../../_components/AuthInputField';
import { Controller, useForm } from 'react-hook-form';
import { EmailPasswordFormData, emailPasswordSchema } from '../../_components/CommonSchemas';
import { zodResolver } from '@hookform/resolvers/zod';

const inputFields: { label: string; type: string; name: keyof EmailPasswordFormData }[] = [
  { label: '이메일', type: 'email', name: 'email' },
  { label: '비밀번호', type: 'password', name: 'password' },
];

interface SingInFormProps {
  onSubmit: (data: EmailPasswordFormData) => void;
}

const SignInForm = ({ onSubmit }: SingInFormProps) => {
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailPasswordFormData>({ resolver: zodResolver(emailPasswordSchema) });

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setValue('email', savedEmail);
    }
  }, [setValue]);

  return (
    <form id="signin-form" onSubmit={handleSubmit(onSubmit)}>
      {inputFields.map((field) => (
        <Controller
          key={field.name}
          name={field.name}
          control={control}
          render={({ field: { value, onChange, ref }, fieldState }) => (
            <div>
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
            </div>
          )}
        />
      ))}
      <button type="submit">로그인</button>
    </form>
  );
};

export default SignInForm;
