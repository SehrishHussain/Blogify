import React, { useId } from 'react';

const Input = React.forwardRef(function Input(
  { label, type = 'text', className = '', ...props },
  ref
) {
  const id = useId();
  return (
    <div className="w-full">
      {label && (
        <label
          className="inline-block mb-1 pl-1 text-gray-700 dark:text-gray-300"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        ref={ref}
        className={`px-3 py-2 rounded-lg 
          bg-white text-black border border-gray-200 
          focus:bg-white focus:border-primary 
          dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:focus:bg-gray-700 
          outline-none duration-200 w-full transition-colors
          ${className}`}
        {...props}
      />
    </div>
  );
});

export default Input;
