import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 active:scale-95 micro-bounce",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 micro-bounce",
        outline:
          "border-2 border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 micro-bounce",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 micro-bounce",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 micro-bounce",
        link: "text-primary underline-offset-4 hover:underline hover:-translate-y-0.5 active:translate-y-0",
        hero: "bg-gradient-primary text-primary-foreground hover:shadow-hero hover:-translate-y-1 active:translate-y-0 active:scale-95 font-semibold btn-shimmer",
        accent: "bg-gradient-to-r from-accent to-accent-light text-accent-foreground hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 active:scale-95 font-semibold",
        success: "bg-success text-success-foreground hover:bg-success/90 hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 active:scale-95",
        premium: "bg-gradient-hero text-primary-foreground hover:shadow-floating hover:-translate-y-1 active:translate-y-0 active:scale-95 font-semibold border-0 btn-shimmer",
        professional: "neumorphic text-primary hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 active:scale-95 font-medium",
        glass: "bg-background/20 backdrop-blur-md border border-primary/20 text-primary hover:bg-background/30 hover:shadow-card hover:-translate-y-0.5 active:translate-y-0",
        gradient: "bg-gradient-rainbow text-white hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 active:scale-95 font-semibold animate-gradient-shift",
        neumorphic: "neumorphic text-primary neumorphic-hover hover:-translate-y-0.5 active:translate-y-0 active:scale-95",
      },
      size: {
        default: "h-11 px-6 py-2.5 text-sm",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg font-semibold",
        xxl: "h-16 rounded-2xl px-12 text-xl font-bold",
        icon: "h-11 w-11 rounded-xl",
        "icon-sm": "h-9 w-9 rounded-lg",
        "icon-lg": "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
