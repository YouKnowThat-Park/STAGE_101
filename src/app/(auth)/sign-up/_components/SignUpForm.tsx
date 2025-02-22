import React from 'react';
import AuthInputField from '../../_components/AuthInputField';

const inputFields = [
  { label: '이메일', type: 'email', name: 'email' },
  { label: '이름', type: 'text', name: 'name' },
  { label: '닉네임', type: 'text', name: 'nickname' },
  { label: '비밀번호', type: 'password', name: 'password' },
  { label: '비밀번호 확인', type: 'password', name: 'confirmPassword' },
  { label: '휴대폰번호', type: 'text', name: 'phone' },
  { label: '생년월일', type: 'text', name: 'birthdate' },
] as const;

interface SignUpFormProps {
  form: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SignUpForm = ({ form, onChange, onSubmit }: SignUpFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      {inputFields.map((field) => (
        <AuthInputField
          key={field.name}
          label={field.label}
          type={field.type}
          name={field.name}
          value={form[field.name]}
          onChange={onChange}
        />
      ))}
      <button type="submit">회원가입</button>
    </form>
  );
};

export default SignUpForm;
