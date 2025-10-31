import { ButtonHTMLAttributes } from "react";

interface BackButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  className = "",
  ...rest
}) => {
  return (
    <button type="button" className={`w-3 ${className}`} {...rest}>
      <img src="/asset/Arrow.svg" alt="back" />
    </button>
  );
};
