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
    "flex items-center justify-center rounded-2xl bg-green-d hover:bg-green-f text-white text-2xl py-2 w-full duration-300 disabled:opacity-30 disabled:cursor-not-allowed";
  return (
    <button className={`${buttonStyle} ${className}`} {...rest}>
      <text>{children}</text>
    </button>
  );
};
