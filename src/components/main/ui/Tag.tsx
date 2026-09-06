import type { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  className?: string;
  size?: 'md' | 'sm';
  variant?: 'primary' | 'soft' | 'dark';
}

const SIZE_CLASSNAMES: Record<NonNullable<TagProps['size']>, string> = {
  md: 'px-3 py-1 text-[14px]',
  sm: 'px-2.5 py-0.5 text-[12px]',
};

const VARIANT_CLASSNAMES: Record<NonNullable<TagProps['variant']>, string> = {
  primary: 'bg-primary-mint-800 text-white font-semibold shadow-xs',
  soft: 'bg-primary-mint-100 text-primary-mint-900 font-semibold',
  dark: 'bg-primary-mint-900 text-white font-semibold',
};

const Tag = ({
  children,
  className = '',
  size = 'md',
  variant = 'soft',
}: TagProps) => {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full tracking-[-0.02em] ${SIZE_CLASSNAMES[size]} ${VARIANT_CLASSNAMES[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Tag;
