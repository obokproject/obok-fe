// hooks/useForm.ts
//폼 상태 관리, 입력 핸들링, 유효성 검사

import { useState } from "react";

interface FormErrors {
  [key: string]: string;
}

export const useForm = <T extends { [key: string]: any }>(initialState: T) => {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const validate = (validationRules: {
    [key: string]: (value: any) => string | null;
  }) => {
    const formErrors: FormErrors = {};
    Object.keys(validationRules).forEach((key) => {
      const error = validationRules[key](values[key]);
      if (error) {
        formErrors[key] = error;
      }
    });
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const resetForm = () => {
    setValues(initialState);
    setErrors({});
  };

  return { values, errors, handleChange, validate, resetForm };
};
