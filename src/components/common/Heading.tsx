interface HeadingProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  className = "",
  ...rest
}) => {
  const headingStyle =
    "flex items-center justify-center w-full h-full text-black text-opacity-50 text-3xl font-light";
  return (
    <p className={`${headingStyle} ${className}`} {...rest}>
      {children}
    </p>
  );
};
