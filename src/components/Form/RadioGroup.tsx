type Option<T extends string> = { label: string; value: T };

type Props<T extends string> = {
  name: string;
  value: T | '';
  onChange: (v: T | '') => void;
  options: Option<T>[];
  className?: string;
};

export const RadioGroup = <T extends string>({
  name,
  value,
  onChange,
  options,
}: Props<T>) => {
  return (
    <div
      role='radiogroup'
      aria-label={`${name}-label`}
      className='flex flex-col gap-y-1'
    >
      {options.map((option) => {
        const id = `${name}-${option.value}`;
        return (
          <label
            key={option.value}
            htmlFor={id}
            className='flex gap-2 cursor-pointer font-bold text-neutral/80 text-md'
          >
            <input
              id={id}
              name={name}
              type='radio'
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className='form-radio'
              aria-checked={value === option.value}
            />
            <span>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
};

export default RadioGroup;
