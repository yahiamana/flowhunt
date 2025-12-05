import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface CourseProgressProps {
  value: number
  variant?: "default" | "success"
  size?: "default" | "sm"
}

export const CourseProgress = ({
  value,
  variant = "default",
  size = "default",
}: CourseProgressProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className={cn(
          "font-medium text-muted-foreground",
          size === "sm" ? "text-xs" : "text-sm"
        )}>
          Progress
        </span>
        <span className={cn(
          "font-semibold",
          variant === "success" && value === 100 ? "text-primary" : "text-foreground",
          size === "sm" ? "text-xs" : "text-sm"
        )}>
          {Math.round(value)}%
        </span>
      </div>
      <Progress
        className="h-2"
        value={value}
      />
      {value === 100 && (
        <p className="text-xs text-primary mt-2 font-medium">
          ✓ Course completed!
        </p>
      )}
    </div>
  )
}
