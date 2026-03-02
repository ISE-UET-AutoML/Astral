import * as React from "react"
import { cn } from "src/lib/utils"

const badgeVariants = {
  default: "bg-accent text-accent-foreground",
  success: "bg-emerald-500/10 text-emerald-500",
  warning: "bg-amber-500/10 text-amber-500",
  error: "bg-red-500/10 text-red-500",
  info: "bg-sky-500/10 text-sky-500",
}

const Badge = React.forwardRef(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        badgeVariants[variant] ?? badgeVariants.default,
        className
      )}
      {...props}
    />
  )
)

Badge.displayName = "Badge"

export { Badge, badgeVariants }

