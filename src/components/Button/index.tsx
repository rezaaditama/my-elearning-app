import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
}

const baseStyle = 'rounded-md font-bold cursor-pointer';

const variantClass = {
  primary: 'bg-primary text-surface hover:bg-primary-hover',
  secondary: 'bg-secondary text-surface hover:bg-secondary-hover',
  accent: 'text-neutral rounded-md border',
  danger: 'bg-danger text-surface hover:bg-danger-hover',
  ghost: 'bg-transparent',
};

const Button = ({
  children,
  type = 'button',
  className,
  variant = 'primary',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(baseStyle, variantClass[variant], className)}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
