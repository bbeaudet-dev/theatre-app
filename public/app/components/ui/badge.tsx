import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline:
          "text-foreground",
        // Neutral badge for skills/tech lists
        skill:
          "bg-neutral-100 text-neutral-700 border border-neutral-200 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-700",
        // Collection-specific variants
        fractal: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
              "beginner-programmer": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
        theatre: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
        gaming: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        // Project status variants
        "published": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        "deployed": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
        "finished": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        "experiment": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        // Theatre district variants
        "broadway": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        "playhouse-square": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        "broadway-touring": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        // Project type variants
        "software": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        "firmware": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        "mechanical": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        "game-dev": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        "ai": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants } 