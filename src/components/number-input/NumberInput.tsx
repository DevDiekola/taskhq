import React from "react";
import { useState } from "react";
import { Input } from "../ui/input";

type Props = React.ComponentProps<"input"> & {
  value?: number;
  onNumberChange: (val?: number) => void;
};
const NumberInput = React.forwardRef<HTMLInputElement, Props>(
  ({ value, onNumberChange, ...props }, ref) => {
    const [inputValue, setInputValue] = useState(
      value !== undefined ? String(value) : ""
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.trim();

      // We want to allow only numeric input (including empty string)
      if (rawValue === "" || /^-?\d*\.?\d*$/.test(rawValue)) {
        setInputValue(rawValue);
        onNumberChange(rawValue === "" ? undefined : Number(rawValue));
      }
    };

    return (
      <Input
        type="text"
        value={inputValue}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
    );
  }
);

export default NumberInput;
