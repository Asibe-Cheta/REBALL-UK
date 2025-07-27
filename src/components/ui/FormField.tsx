'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ValidationRule, validateField, getFieldErrorClass, getFieldSuccessClass } from '@/utils/formValidation';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'textarea' | 'select';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  rules?: ValidationRule;
  options?: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helpText?: string;
}

export default function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  rules,
  options = [],
  required = false,
  disabled = false,
  className = '',
  helpText
}: FormFieldProps) {
  const [touched, setTouched] = useState(false);
  const [validation, setValidation] = useState({ isValid: true, errors: [] });

  useEffect(() => {
    if (rules && touched) {
      const result = validateField(value, rules);
      setValidation(result);
    }
  }, [value, rules, touched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    setTouched(true);
    onBlur?.();
  };

  const getInputClasses = () => {
    const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors';
    const errorClasses = getFieldErrorClass(validation.errors.length > 0, touched);
    const successClasses = getFieldSuccessClass(validation.isValid, touched);

    return `${baseClasses} ${errorClasses} ${successClasses} ${className}`;
  };

  const renderInput = () => {
    const commonProps = {
      id: name,
      name,
      value,
      onChange: handleChange,
      onBlur: handleBlur,
      placeholder,
      disabled,
      className: getInputClasses(),
      required
    };

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={4}
            className={`${getInputClasses()} resize-none`}
          />
        );

      case 'select':
        return (
          <select {...commonProps}>
            <option value="">{placeholder || 'Select an option'}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return <input {...commonProps} type={type} />;
    }
  };

  const getStatusIcon = () => {
    if (!touched) return null;

    if (validation.errors.length > 0) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }

    if (validation.isValid && value) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }

    return null;
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {renderInput()}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {getStatusIcon()}
        </div>
      </div>

      {helpText && (
        <p className="text-sm text-gray-500 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {helpText}
        </p>
      )}

      {touched && validation.errors.length > 0 && (
        <div className="text-sm text-red-600 space-y-1">
          {validation.errors.map((error, index) => (
            <p key={index} className="flex items-center">
              <XCircle className="w-4 h-4 mr-1 flex-shrink-0" />
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
} 