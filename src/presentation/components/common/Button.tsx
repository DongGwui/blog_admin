'use client';

import { ButtonHTMLAttributes, forwardRef, CSSProperties } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

interface VariantStyle {
  base: CSSProperties;
  hover: string;
  disabled: CSSProperties;
}

const getVariantStyles = (variant: ButtonVariant): VariantStyle => {
  const styles: Record<ButtonVariant, VariantStyle> = {
    primary: {
      base: {
        background: 'var(--primary)',
        color: 'white',
      },
      hover: 'hover:opacity-90',
      disabled: {
        background: 'var(--primary)',
        opacity: 0.5,
      },
    },
    secondary: {
      base: {
        background: 'var(--surface-elevated)',
        color: 'var(--text-primary)',
      },
      hover: 'hover:opacity-80',
      disabled: {
        background: 'var(--surface)',
        color: 'var(--text-tertiary)',
      },
    },
    danger: {
      base: {
        background: 'var(--error)',
        color: 'white',
      },
      hover: 'hover:opacity-90',
      disabled: {
        background: 'var(--error)',
        opacity: 0.5,
      },
    },
    ghost: {
      base: {
        background: 'transparent',
        color: 'var(--text-secondary)',
      },
      hover: 'hover:bg-[var(--surface-hover)]',
      disabled: {
        color: 'var(--text-tertiary)',
      },
    },
    outline: {
      base: {
        background: 'transparent',
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
      },
      hover: 'hover:bg-[var(--surface-hover)]',
      disabled: {
        color: 'var(--text-tertiary)',
        borderColor: 'var(--border)',
        opacity: 0.5,
      },
    },
  };
  return styles[variant];
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      className = '',
      children,
      style,
      ...props
    },
    ref
  ) => {
    const variantStyle = getVariantStyles(variant);
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center
          font-medium rounded-lg
          focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)]
          transition-all duration-200
          disabled:cursor-not-allowed
          ${variantStyle.hover}
          ${sizeStyles[size]}
          ${className}
        `}
        style={{
          ...variantStyle.base,
          ...(isDisabled ? variantStyle.disabled : {}),
          ...style,
        }}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
