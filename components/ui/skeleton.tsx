import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-blue-500/100 dark:bg-blue-500/100", className)}
      {...props}
    />
  )
}

export { Skeleton }
