import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'soft'
  | 'neutral'
  | 'danger'
  | 'warning';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSNAMES: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-mint-800 text-white shadow-xs hover:bg-primary-mint-850 hover:shadow-sm disabled:bg-gray-300 disabled:text-white disabled:shadow-none',
  secondary:
    'bg-white border border-primary-mint-800/60 text-primary-mint-900 shadow-xs hover:bg-primary-mint-200/40 hover:border-primary-mint-800 disabled:opacity-50 disabled:border-gray-300 disabled:text-gray-300 disabled:bg-white',
  soft:
    'bg-primary-mint-200/50 border border-primary-mint-800/25 text-primary-mint-900 shadow-xs hover:bg-primary-mint-200 hover:border-primary-mint-800/45 disabled:opacity-50',
  neutral:
    'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50',
  danger:
    'bg-red-500 text-white shadow-xs hover:bg-red-600 disabled:bg-gray-300 disabled:text-white disabled:shadow-none',
  warning:
    'bg-amber-500 text-white shadow-xs hover:bg-amber-600 disabled:opacity-60',
};

const SIZE_CLASSNAMES: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-[14px]',
  md: 'px-5 py-2.5 text-[15px]',
  lg: 'px-6 py-3.5 text-[16px]',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold cursor-pointer transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 ${
        fullWidth ? 'w-full' : ''
      } ${VARIANT_CLASSNAMES[variant]} ${SIZE_CLASSNAMES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
