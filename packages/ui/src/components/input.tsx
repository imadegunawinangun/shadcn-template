import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

function Input({ className, type, leftIcon, rightIcon, ...props }: InputProps) {
  return (
    <div className="relative flex w-full items-center">
      {leftIcon && (
        <div className="absolute left-3 flex items-center justify-center text-muted-foreground/70">
          {leftIcon}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          leftIcon && "pl-10",
          rightIcon && "pr-10",
          className
        )}
        {...props}
      />
      {rightIcon && (
        <div className="absolute right-3 flex items-center justify-center text-muted-foreground/70">
          {rightIcon}
        </div>
      )}
    </div>
  )
}

export { Input }
