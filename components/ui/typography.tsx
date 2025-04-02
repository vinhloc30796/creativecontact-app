import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Typography scale based on a modular scale with improved readability
// Reserved for page titles and main headings
const headingVariants = cva(
  "font-bold leading-tight tracking-tighter text-foreground",
  {
    variants: {
      size: {
        "1": "text-4xl lg:text-5xl", // Reserved for main titles only
        "2": "text-3xl lg:text-4xl",
        "3": "text-2xl lg:text-3xl",
        "4": "text-xl lg:text-2xl",
        "5": "text-lg lg:text-xl",
        "6": "text-base lg:text-lg",
        "7": "text-sm lg:text-base",
      },
      // Add color variants for more flexibility
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        accent: "text-primary",
      },
    },
    defaultVariants: {
      size: "1",
      variant: "default",
    },
  }
)

// Hero title variants for large, impactful page titles
const heroTitleVariants = cva(
  "font-bricolage-grotesque font-bold tracking-tighter text-foreground",
  {
    variants: {
      size: {
        default: "text-[clamp(2rem,10vw,20rem)] md:text-[clamp(2rem,11.5vw,20rem)] leading-[1.1]",
        medium: "text-[clamp(2rem,7vw,6rem)] md:text-[clamp(2rem,10vw,6rem)] leading-[1.1]",
        small: "text-[clamp(2rem,5vw,4rem)] md:text-[clamp(2rem,7vw,4rem)] leading-[1.1]",
      },
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        accent: "text-primary",
        contrast: "text-white", // High contrast for dark backgrounds
      },
      // Add a new bordered property to enable text borders
      bordered: {
        none: "",
        outline: "-webkit-text-stroke: 2px currentColor", // Uses current text color for outline
        shadow: "text-shadow: -1px -1px 0 currentColor, 1px -1px 0 currentColor, -1px 1px 0 currentColor, 1px 1px 0 currentColor", // Text shadow outline
        black: "-webkit-text-stroke: 2px black", // Black outline, text color set separately
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
      bordered: "none",
    },
  }
)

// Paragraph variants with slightly adjusted sizes
// Making paragraphs only slightly larger than text-base
const paragraphVariants = cva(
  "leading-7 text-foreground/90",
  {
    variants: {
      size: {
        default: "text-[15px] md:text-[16px]", // Just slightly larger than base
        sm: "text-sm",
        lg: "text-base md:text-lg",
      },
      variant: {
        default: "",
        muted: "text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

const blockquoteVariants = cva(
  "mt-6 border-l-2 border-border pl-6 italic text-muted-foreground",
  {
    variants: {
      size: {
        default: "text-[15px]",
        sm: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const listVariants = cva(
  "my-6 ml-6 [&>li]:mt-2",
  {
    variants: {
      size: {
        default: "text-[15px]",
        sm: "text-sm",
        lg: "text-base",
      },
      type: {
        disc: "list-disc",
        decimal: "list-decimal",
        none: "list-none",
      },
    },
    defaultVariants: {
      size: "default",
      type: "disc",
    },
  }
)

const inlineCodeVariants = cva(
  "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  {
    variants: {
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

// Lead paragraph - for introductory text
const leadVariants = cva(
  "text-foreground/80 font-medium",
  {
    variants: {
      size: {
        default: "text-lg md:text-xl",
        sm: "text-base md:text-lg",
        lg: "text-xl md:text-2xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

// For emphasized text
const largeVariants = cva(
  "font-semibold text-foreground",
  {
    variants: {
      size: {
        default: "text-base md:text-lg",
        sm: "text-sm md:text-base",
        lg: "text-lg md:text-xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

// For de-emphasized text
const smallVariants = cva(
  "text-muted-foreground",
  {
    variants: {
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

// Add caption variant for image captions, etc.
const captionVariants = cva(
  "text-center text-muted-foreground italic",
  {
    variants: {
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
  VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

interface HeroTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
  VariantProps<typeof heroTitleVariants> {
  as?: "h1" | "h2"
}

// HeroTitle component for large, impactful page titles
const HeroTitle = React.forwardRef<HTMLHeadingElement, HeroTitleProps>(
  ({ className, size, variant, bordered, as = "h1", ...props }, ref) => {
    const Comp = as
    return (
      <Comp
        className={cn(heroTitleVariants({ size, variant, bordered, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
HeroTitle.displayName = "HeroTitle"

// H1 is reserved for page titles only
const H1 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, variant, as = "h1", ...props }, ref) => {
    const Comp = as
    return (
      <Comp
        className={cn(headingVariants({ size, variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
H1.displayName = "H1"

const H2 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size = "2", variant, as = "h2", ...props }, ref) => {
    const Comp = as
    return (
      <Comp
        className={cn(headingVariants({ size, variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
H2.displayName = "H2"

const H3 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size = "3", variant, as = "h3", ...props }, ref) => {
    const Comp = as
    return (
      <Comp
        className={cn(headingVariants({ size, variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
H3.displayName = "H3"

const H4 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size = "4", variant, as = "h4", ...props }, ref) => {
    const Comp = as
    return (
      <Comp
        className={cn(headingVariants({ size, variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
H4.displayName = "H4"

const H5 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size = "5", variant, as = "h5", ...props }, ref) => {
    const Comp = as
    return (
      <Comp
        className={cn(headingVariants({ size, variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
H5.displayName = "H5"

const H6 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size = "6", variant, as = "h6", ...props }, ref) => {
    const Comp = as
    return (
      <Comp
        className={cn(headingVariants({ size, variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
H6.displayName = "H6"

// H7 is not a standard HTML heading but useful for the smallest heading size
const H7 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'as'>>(
  ({ className, size = "7", variant, ...props }, ref) => {
    return (
      <h6
        className={cn(headingVariants({ size, variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
H7.displayName = "H7"

interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
  VariantProps<typeof paragraphVariants> { }

const P = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, size, variant, ...props }, ref) => {
    return (
      <p
        className={cn(paragraphVariants({ size, variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
P.displayName = "P"

interface BlockquoteProps
  extends React.HTMLAttributes<HTMLQuoteElement>,
  VariantProps<typeof blockquoteVariants> { }

const Blockquote = React.forwardRef<HTMLQuoteElement, BlockquoteProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <blockquote
        className={cn(blockquoteVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Blockquote.displayName = "Blockquote"

interface ListProps
  extends React.HTMLAttributes<HTMLUListElement>,
  VariantProps<typeof listVariants> { }

const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ className, size, type, ...props }, ref) => {
    return (
      <ul
        className={cn(listVariants({ size, type, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
List.displayName = "List"

// Add OrderedList component for better semantics
const OrderedList = React.forwardRef<HTMLOListElement, Omit<ListProps, 'type'>>(
  ({ className, size, ...props }, ref) => {
    return (
      <ol
        className={cn(listVariants({ size, type: "decimal", className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
OrderedList.displayName = "OrderedList"

interface InlineCodeProps
  extends React.HTMLAttributes<HTMLElement>,
  VariantProps<typeof inlineCodeVariants> { }

const InlineCode = React.forwardRef<HTMLElement, InlineCodeProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <code
        className={cn(inlineCodeVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
InlineCode.displayName = "InlineCode"

interface LeadProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
  VariantProps<typeof leadVariants> { }

const Lead = React.forwardRef<HTMLParagraphElement, LeadProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <p
        className={cn(leadVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Lead.displayName = "Lead"

interface LargeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof largeVariants> { }

const Large = React.forwardRef<HTMLDivElement, LargeProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <div
        className={cn(largeVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Large.displayName = "Large"

interface SmallProps
  extends React.HTMLAttributes<HTMLElement>,
  VariantProps<typeof smallVariants> { }

const Small = React.forwardRef<HTMLElement, SmallProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <small
        className={cn(smallVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Small.displayName = "Small"

interface CaptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
  VariantProps<typeof captionVariants> { }

const Caption = React.forwardRef<HTMLParagraphElement, CaptionProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <p
        className={cn(captionVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Caption.displayName = "Caption"

export {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  H7,
  P,
  Blockquote,
  List,
  OrderedList,
  InlineCode,
  Lead,
  Large,
  Small,
  Caption,
  HeroTitle,
  headingVariants,
  paragraphVariants,
  blockquoteVariants,
  listVariants,
  inlineCodeVariants,
  leadVariants,
  largeVariants,
  smallVariants,
  captionVariants,
  heroTitleVariants,
} 