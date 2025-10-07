import { ButtonHTMLAttributes } from "react";

interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
}
export const TextButton: React.FC<TextButtonProps> = ({
  children,
  className = "",
  ...rest
}) => {
  return (
    <button
      className="flex items-center justify-center w-full text-green-f underline hover:text-green-d  duration-300 "
      {...rest}
    >
      {children}
    </button>
  );
};
