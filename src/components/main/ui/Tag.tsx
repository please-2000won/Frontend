import type { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  className?: string;
  size?: 'md' | 'sm';
}

const SIZE_CLASSNAMES: Record<NonNullable<TagProps['size']>, string> = {
  md: 'px-[10px] py-[5px] text-[16px]',
  sm: 'px-2 py-0.5 text-[12px]',
};

const Tag = ({ children, className = '', size = 'md' }: TagProps) => {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[4px] bg-primary-mint-900 font-bold text-white ${SIZE_CLASSNAMES[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Tag;
