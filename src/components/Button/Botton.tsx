import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  ...rest
}) => {
  const buttonStyle =
    "flex items-center justify-center rounded-3xl bg-green-100 hover:bg-green-300 text-green-900 border border-green-600 py-5 w-full transition-colors duration-300";
  return (
    <button className={`${buttonStyle} ${className}`} {...rest}>
      <text>{children}</text>
    </button>
  );
};
