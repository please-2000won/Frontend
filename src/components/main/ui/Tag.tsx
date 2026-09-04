import type { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  className?: string;
}

const Tag = ({ children, className = '' }: TagProps) => {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[4px] bg-primary-mint-900 px-[10px] py-[5px] text-[16px] font-bold text-white ${className}`}
    >
      {children}
    </span>
  );
};

export default Tag;
