import React from 'react';
import clsx from 'clsx';

type Props = {
  id?: string;
  label?: React.ReactNode;
  children: React.ReactNode;
  error?: string | null;
  className?: string;
};

export const FormField: React.FC<Props> = ({
  id,
  label,
  children,
  error,
  className,
}) => {
  return (
    <div className={clsx('flex flex-col gap-y-1', className)}>
      {label && (
        <label htmlFor={id} className='font-bold text-neutral/80 text-md'>
          {label}
        </label>
      )}
      {children}
      {error && (
        <p role='alert' className='text-sm text-danger mt-1'>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
