import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'neumorphic' | 'glass' | 'gradient' | 'elevated' | 'interactive'
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: "rounded-2xl border bg-card text-card-foreground shadow-card transition-all duration-300",
    neumorphic: "neumorphic rounded-2xl text-card-foreground transition-all duration-300 hover:shadow-card hover:-translate-y-1",
    glass: "rounded-2xl bg-background/40 backdrop-blur-md border border-primary/10 text-card-foreground shadow-card transition-all duration-300",
    gradient: "rounded-2xl bg-gradient-card text-card-foreground shadow-card border-0 transition-all duration-300",
    elevated: "rounded-2xl bg-card text-card-foreground shadow-floating border-0 transition-all duration-300 hover:shadow-hero hover:-translate-y-2",
    interactive: "neumorphic rounded-2xl text-card-foreground transition-all duration-300 hover:shadow-card hover:-translate-y-1 cursor-pointer group"
  }
  
  return (
    <div
      ref={ref}
      className={cn(variants[variant], className)}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-8", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-display font-semibold leading-tight tracking-tight text-foreground",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-8 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-8 pt-0 gap-4", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
