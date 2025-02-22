import React from 'react';

export interface AuthInputFiledProps {
  label: string;
  type: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthInputField = ({ label, type, value, onChange, name }: AuthInputFiledProps) => {
  return (
    <div>
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} name={name} />
    </div>
  );
};

export default AuthInputField;
