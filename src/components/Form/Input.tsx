import clsx from 'clsx';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | undefined | null;
  inputClassName?: string;
  labelClassName?: string;
}

const baseStyleInput =
  'w-full border rounded-md p-2 border-neutral/50 focus:outline-neutral/50 focus:outline-1 text-md';
const baseStyleLabel = 'font-bold text-neutral/80 text-md';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, inputClassName, labelClassName, id, error, ...props }, ref) => {
    return (
      <div className=''>
        {label && (
          <label htmlFor={id} className={clsx(baseStyleLabel, labelClassName)}>
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          aria-invalid={!!error}
          className={clsx(
            baseStyleInput,
            inputClassName,
            error && 'border-danger'
          )}
          {...props}
        />
        {error && (
          <p role='alert' className='text-sm text-danger mt-1'>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
