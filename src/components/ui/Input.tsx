import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Inputs = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, icon, className = '', ...props }, ref) => {
    const baseClasses = 'bg-white dark:bg-gray-800 rounded-full transition-colors duration-300 ease-in-out py-2 shadow-sm border border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 dark:border-gray-700 dark:text-white placeholder:text-sm placeholder:text-gray-400 placeholder:font-medium';
    const errorClasses = 'border-red-500 focus:border-red-500 focus:ring-red-500';
    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <div className={`${widthClass} ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
          </label>
        )}
        <div className="relative">
          {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
          )}
          <input
        ref={ref}
        className={`${baseClasses} rounded-full ${error ? errorClasses : ''} ${icon ? 'pl-10 pr-5' : ''} ${widthClass}`}
        {...props}
          />
        </div>
        {error && (
          <div className="flex items-start gap-2 mt-3 px-4 py-1 rounded-lg border border-red-300 dark:border-red-700 bg-red-50/60 dark:bg-red-900/40 text-red-700 dark:text-red-200 text-sm font-medium backdrop-blur-md animate-shake transition-all duration-300 break-words whitespace-normal">
        <svg
          className="w-4 h-4 mt-1 text-red-600 dark:text-red-300 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
          />
        </svg>
        <span className="break-words">{error}</span>
          </div>
        )}
      </div>
    )
  }
  
);

Inputs.displayName = 'Inputs';


export default Inputs;