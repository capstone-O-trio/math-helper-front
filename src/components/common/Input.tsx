import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  className?: string;
}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ children, className = "", ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className="flex items-center justify-center w-full border border-black border-opacity-50 rounded-xl py-2 px-6 focus:outline-none focus:border-green-d duration-300"
        {...rest}
      />
    );
  }
);
