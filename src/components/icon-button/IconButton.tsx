import { cn } from "@/lib/utils";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const IconButton = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      // aria-label={ariaLabel}
      // onClick={onClick}
      {...props}
      className={cn(
        "rounded-md duration-200 ease-in-out cursor-pointer",
        props.className
      )}
    >
      {props.children}
    </button>
  );
});

IconButton.displayName = "IconButton";

export default IconButton;
