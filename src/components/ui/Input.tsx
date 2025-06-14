import React, { forwardRef } from 'react';
import { Alert } from "@heroui/react";

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
            className={`${baseClasses} rounded-full ${error ? errorClasses : ''} ${icon ? 'pl-10 pr-5': ''} ${widthClass}`}
            {...props}
          />
        </div>
        {error && (
          <Alert
            hideIcon color="danger"
            variant="faded"
            title={error}
            className="mt-2 px-3 py-0 text-xs leading-tight rounded-full"
          />
        )}
      </div>
    );
  }
);

Inputs.displayName = 'Inputs';


export default Inputs;