import { cn } from "@/lib/general/utils";

interface LoadingScreenProps {
  className?: string;
}

export const LoadingScreen = ({ className }: LoadingScreenProps) => (
  <div
    className={cn(
      "flex min-h-screen flex-col items-center justify-center bg-background",
      className
    )}
  >
    <div className="flex flex-col items-center gap-8">
      {/* Animated spinner */}
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />

        {/* Spinner container */}
        <div className="relative h-20 w-20">
          {/* Spinning gradient ring */}
          <svg
            className="h-20 w-20 animate-spin"
            viewBox="0 0 80 80"
            fill="none"
          >
            <defs>
              <linearGradient
                id="loadingGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ffd700" />
                <stop offset="50%" stopColor="#ffa500" />
                <stop offset="100%" stopColor="#ff8c00" />
              </linearGradient>
            </defs>
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="4"
              className="text-muted-foreground/20"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="url(#loadingGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="170 226"
            />
          </svg>

          {/* Center percentage icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">1%</span>
          </div>
        </div>
      </div>

      {/* Loading text with animation */}
      <div className="flex items-center gap-1">
        <span className="text-lg font-medium text-muted-foreground">
          Loading
        </span>
        <span className="flex gap-1">
          <span
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: "300ms" }}
          />
        </span>
      </div>
    </div>
  </div>
);
