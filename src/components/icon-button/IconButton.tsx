import { cn } from "@/lib/utils";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const IconButton = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      {...props}
      className={cn(
        "rounded-md duration-300 ease-in-out cursor-pointer",
        props.className
      )}
    >
      {props.children}
    </button>
  );
});

IconButton.displayName = "IconButton";

export default IconButton;
