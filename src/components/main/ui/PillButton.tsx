import type { ButtonHTMLAttributes } from 'react';
import Button from '../../common/Button';

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outline';
  size?: 'sm' | 'lg';
}

const PillButton = ({
  variant = 'outline',
  size = 'sm',
  className = '',
  children,
  ...props
}: PillButtonProps) => {
  return (
    <Button
      variant={variant === 'filled' ? 'primary' : 'secondary'}
      size={size}
      className={`shrink-0 whitespace-nowrap ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default PillButton;
