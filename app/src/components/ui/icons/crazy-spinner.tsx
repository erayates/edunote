import { cn } from "@/lib/utils";
import React from "react";

interface CrazySpinnerProps {
  className?: string;
}
const CrazySpinner: React.FC<CrazySpinnerProps> = ({ className }) => {
  return (
    <div className="flex items-center justify-center gap-0.5">
      <div
        className={cn(
          "h-1.5 w-1.5 animate-bounce rounded-full bg-red-500 [animation-delay:-0.3s]",
          className && className
        )}
      />
      <div
        className={cn(
          "h-1.5 w-1.5 animate-bounce rounded-full bg-red-500 [animation-delay:-0.15s]",
          className && className
        )}
      />
      <div
        className={cn(
          "h-1.5 w-1.5 animate-bounce rounded-full bg-red-500",
          className && className
        )}
      />
    </div>
  );
};

export default CrazySpinner;
