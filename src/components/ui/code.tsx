
import React from "react";
import { cn } from "@/lib/utils";

interface CodeProps extends React.HTMLAttributes<HTMLPreElement> {}

const Code = React.forwardRef<HTMLPreElement, CodeProps>(
  ({ className, ...props }, ref) => {
    return (
      <pre
        ref={ref}
        className={cn(
          "bg-muted font-mono text-sm p-4 rounded-md overflow-x-auto",
          className
        )}
        {...props}
      />
    );
  }
);
Code.displayName = "Code";

export { Code };
