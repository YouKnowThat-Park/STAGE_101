'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpFormData, signupSchema } from '../../_components/SignUpSchema';
import AuthInputField from '../../_components/AuthInputField';

interface SignUpFormProps {
  onSubmit: (data: SignUpFormData) => void;
}

// 👉 스텝별 필드 분리
const stepFields: { label: string; type: string; name: keyof SignUpFormData }[][] = [
  [
    { label: '이메일', type: 'email', name: 'email' },
    { label: '닉네임', type: 'text', name: 'nickname' },
    { label: '이름', type: 'text', name: 'name' },
  ],
  [
    { label: '비밀번호', type: 'password', name: 'password' },
    { label: '비밀번호 확인', type: 'password', name: 'confirmPassword' },
  ],
  [
    { label: '휴대폰번호', type: 'text', name: 'phone' },
    { label: '생년월일', type: 'text', name: 'birthdate' },
  ],
];

const SignUpForm = ({ onSubmit }: SignUpFormProps) => {
  const {
    control,
    handleSubmit,
    trigger,
    setFocus,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      nickname: '',
      phone: '',
      birthdate: '',
    },
  });

  const [step, setStep] = useState(0);
  const isLastStep = step === stepFields.length - 1;

  // 🔸 유효성 검사 후 다음 스텝 이동
  const handleNext = async () => {
    const currentFieldNames = stepFields[step].map((field) => field.name);
    const isValid = await trigger(currentFieldNames);

    if (isValid) {
      setStep((prev) => prev + 1);
    } else {
      const firstErrorField = currentFieldNames.find((name) => !!errors[name]);
      if (firstErrorField) {
        setFocus(firstErrorField);
      }
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleFinalSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <form onSubmit={handleFinalSubmit} className="flex flex-col gap-4 w-full max-w-[360px] mx-auto">
      {stepFields[step].map((field) => (
        <Controller
          key={field.name}
          name={field.name}
          control={control}
          render={({ field: { value, onChange, ref }, fieldState }) => {
            // 🔍 에러 콘솔 확인
            if (fieldState.error) {
              console.log(`🔥 field: ${field.name}`, fieldState.error);
            }

            return (
              <div>
                <AuthInputField
                  label={field.label}
                  type={field.type}
                  value={value ?? ''}
                  onChange={onChange}
                  ref={ref}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                )}
              </div>
            );
          }}
        />
      ))}

      <div className="flex justify-between mt-4">
        {step > 0 && (
          <button type="button" onClick={handleBack}>
            ← 이전
          </button>
        )}

        {!isLastStep ? (
          <button type="button" onClick={handleNext}>
            다음 →
          </button>
        ) : (
          <button type="submit">회원가입</button>
        )}
      </div>
    </form>
  );
};

export default SignUpForm;
