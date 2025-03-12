import React, { forwardRef } from 'react';

interface AuthInputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthInputField = forwardRef<HTMLInputElement, AuthInputFieldProps>(
  ({ label, type, value, onChange }, ref) => {
    return (
      <div>
        <label>{label}</label>
        <input ref={ref} type={type} value={value} onChange={onChange} className=" w-full h-10" />
      </div>
    );
  },
);

export default AuthInputField;
