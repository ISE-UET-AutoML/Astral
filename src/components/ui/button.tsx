import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/src/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
        gradientHover:
          "border-0 font-poppins font-bold uppercase tracking-[0.22em] text-xs !text-white " +
          "bg-left bg-[length:200%_100%] bg-gradient-to-r from-[#3d6ff5] via-[#5C8DFF] to-[#65FFA0] " +
          "shadow-[0_10px_40px_-8px_rgba(92,141,255,0.85),0_4px_20px_-8px_rgba(101,255,160,0.35)] " +
          "hover:bg-[position:100%_0] hover:-translate-y-0.5 " +
          "hover:shadow-[0_16px_56px_-6px_rgba(92,141,255,0.9),0_8px_28px_-6px_rgba(101,255,160,0.5)] " +
          "active:translate-y-0 " +
          "rounded-xl transition-all duration-300 ease-out " +
          "focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[#65FFA0]/50",
        gradientOutline:
          "border-2 font-poppins font-bold uppercase tracking-[0.22em] text-xs " +
          "border-[#5C8DFF]/70 text-slate-900 dark:text-white " +
          "bg-white/70 dark:bg-slate-950/40 backdrop-blur-md " +
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_0_1px_rgba(92,141,255,0.15)] " +
          "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_32px_-12px_rgba(92,141,255,0.4)] " +
          "hover:border-[#65FFA0] hover:bg-[#5C8DFF]/12 dark:hover:bg-[#5C8DFF]/15 " +
          "hover:-translate-y-0.5 hover:shadow-[0_0_36px_-8px_rgba(101,255,160,0.45)] " +
          "active:translate-y-0 " +
          "rounded-xl transition-all duration-300 ease-out " +
          "focus-visible:border-[#65FFA0]/60 focus-visible:ring-2 focus-visible:ring-[#5C8DFF]/35",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
        hero:
          "h-14 min-h-14 px-8 gap-2 rounded-xl text-[0.8125rem] leading-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  href,
  width,
  style,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    href?: string
    width?: string | number
  }) {
  const mergedStyle =
    width !== undefined
      ? { ...(style as React.CSSProperties), width }
      : style
  const classes = cn(buttonVariants({ variant, size, className }))

  if (asChild) {
    return (
      <Slot.Root
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={classes}
        style={mergedStyle}
        {...props}
      />
    )
  }

  if (href !== undefined) {
    return (
      <a
        data-slot="button"
        data-variant={variant}
        data-size={size}
        href={href}
        className={classes}
        style={mergedStyle}
        {...(props as unknown as React.ComponentProps<"a">)}
      />
    )
  }

  return (
    <button
      type="button"
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={classes}
      style={mergedStyle}
      {...props}
    />
  )
}

export { Button, buttonVariants }
