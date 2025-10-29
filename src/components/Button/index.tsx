import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
}

const baseStyle = 'w-full rounded-md font-bold cursor-pointer';

const variantClass = {
  primary: 'bg-primary text-surface hover:bg-primary-hover p-1.5',
  secondary: 'bg-secondary text-surface hover:bg-secondary-hover p-1.5',
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
