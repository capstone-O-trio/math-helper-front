interface TextProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
}

export const Text: React.FC<TextProps> = ({
  children,
  className = "",
  ...rest
}) => {
  const textStyle = "text-black text-opacity-50 text-xl font-light whitespace-nowrap";
  return (
    <p className={`${textStyle} ${className}`} {...rest}>
      {children}
    </p>
  );
};
