/**
 * FormInput Component
 * 
 * A form input component with integrated validation and error handling.
 * 
 * @example
 * ```tsx
 * <FormInput
 *   name="email"
 *   label="Email"
 *   type="email"
 *   register={register}
 *   error={errors.email}
 * />
 * ```
 */

import React from 'react';
import { Input } from '../ui/Input';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  error?: string;
  helperText?: string;
  register?: any; // react-hook-form register function
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  error,
  helperText,
  register,
  ...props
}) => {
  // TODO: Integrate with react-hook-form if register is provided
  // This is a placeholder component structure
  
  return (
    <Input
      {...(register ? register(name) : {})}
      name={name}
      label={label}
      error={error}
      helperText={helperText}
      {...props}
    />
  );
};

export default FormInput;

