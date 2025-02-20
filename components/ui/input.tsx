import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-blue-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-blue-950 placeholder:text-blue-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-950 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-blue-800 dark:file:text-blue-50 dark:placeholder:text-blue-400 dark:focus-visible:ring-blue-300 dark:text-blue-500",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
