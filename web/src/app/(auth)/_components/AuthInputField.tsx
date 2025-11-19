import React, { forwardRef } from 'react';
import { AuthInputFieldProps } from 'src/types/auth/auth-type';

const AuthInputField = forwardRef<HTMLInputElement, AuthInputFieldProps>(
  ({ label, type, value, onChange }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm text-white">{label}</label>
        <input
          ref={ref}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          className="w-full h-10 px-3 rounded-md bg-white text-black outline-none focus:ring-2 focus:ring-[#C9A66B]"
        />
      </div>
    );
  },
);

AuthInputField.displayName = 'AuthInputField';
export default AuthInputField;
