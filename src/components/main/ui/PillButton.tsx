import type { ButtonHTMLAttributes } from 'react';

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outline';
  size?: 'sm' | 'lg';
}

const VARIANT_CLASSNAMES: Record<NonNullable<PillButtonProps['variant']>, string> = {
  filled: 'bg-primary-mint-800 text-white hover:bg-primary-mint-900',
  outline:
    'bg-white border border-primary-mint-900 text-primary-mint-900 hover:bg-primary-mint-200',
};

const SIZE_CLASSNAMES: Record<NonNullable<PillButtonProps['size']>, string> = {
  sm: 'px-[24px] py-[12px] text-[16px]',
  lg: 'px-[36px] py-[16px] text-[24px]',
};

const PillButton = ({
  variant = 'outline',
  size = 'sm',
  className = '',
  children,
  ...props
}: PillButtonProps) => {
  return (
    <button
      className={`shrink-0 cursor-pointer whitespace-nowrap rounded-[100px] font-semibold tracking-[-0.8px] transition-colors ${VARIANT_CLASSNAMES[variant]} ${SIZE_CLASSNAMES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default PillButton;
