import { forwardRef } from 'react';
import clsx from 'clsx';

type Option = { label: string; value: string | number };

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options?: Option[];
  placeholder?: string;
  className?: string;
};

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ options = [], placeholder, className, children, ...rest }, ref) => {
    return (
      <select
        ref={ref}
        className={clsx(
          'w-full border rounded-md p-2 mt-1 block px-3 py-2 border-neutral/50 shadow-sm focus:outline-neutral/50 focus:outline-1',
          className
        )}
        {...rest}
      >
        {placeholder !== undefined && <option value=''>{placeholder}</option>}
        {options.length > 0
          ? options.map((o) => (
              <option key={String(o.value)} value={o.value}>
                {o.label}
              </option>
            ))
          : children}
      </select>
    );
  }
);

Select.displayName = 'Select';
export default Select;
