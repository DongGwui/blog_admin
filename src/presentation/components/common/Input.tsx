'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2
            rounded-lg
            focus:outline-none focus:ring-2 focus:ring-offset-0
            transition-all duration-200
            disabled:cursor-not-allowed
            ${className}
          `}
          style={{
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            border: error ? '1px solid var(--error)' : '1px solid var(--border)',
            ...(props.disabled ? { background: 'var(--surface-elevated)', color: 'var(--text-tertiary)' } : {}),
          }}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm" style={{ color: 'var(--error)' }}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
