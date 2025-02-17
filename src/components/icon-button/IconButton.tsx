import { cn } from "@/lib/utils";

const IconButton = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-md p-1 duration-100 ease-in hover:bg-muted cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};

export default IconButton;
