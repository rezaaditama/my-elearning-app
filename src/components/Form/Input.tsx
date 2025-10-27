import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
  inputClassName?: string;
  labelClassName?: string;
  id: string;
}

const baseStyleInput =
  'w-full border rounded-md p-2 border-neutral/50 focus:outline-neutral/50 focus:outline-1 text-md';
const baseStyleLabel = 'font-bold text-neutral/80 text-md';

const Input = ({
  label,
  type = 'text',
  name,
  inputClassName,
  labelClassName,
  id,
  ...props
}: InputProps) => {
  return (
    <>
      {label && (
        <label htmlFor={id} className={clsx(baseStyleLabel, labelClassName)}>
          {label}
        </label>
      )}
      <input
        id={id}
        name={name || id}
        type={type}
        className={clsx(baseStyleInput, inputClassName)}
        {...props}
      />
    </>
  );
};

export default Input;
