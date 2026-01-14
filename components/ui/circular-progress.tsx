"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/general/utils";

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showValue?: boolean;
  animate?: boolean;
  duration?: number;
  children?: React.ReactNode;
  progress?: number; // 0-100 representing how much time has passed
}

export const CircularProgress = ({
  value,
  size = 120,
  strokeWidth = 6,
  className,
  showValue = true,
  animate = true,
  duration = 1,
  children,
  progress = 100, // Default to full circle
}: CircularProgressProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate stroke dash offset based on progress (inverse - starts full, depletes over time)
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsAnimating(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={ref} className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="25%" stopColor="#ffed4e" />
            <stop offset="50%" stopColor="#ffa500" />
            <stop offset="75%" stopColor="#ff8c00" />
            <stop offset="100%" stopColor="#ffd700" />
          </linearGradient>
          <linearGradient id="goldGradientDim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd700" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#ffa500" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ff8c00" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Background circle - always visible */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#goldGradientDim)"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle - animates from full to empty */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: isAnimating && animate ? `stroke-dashoffset ${duration}s linear` : 'none',
            transformOrigin: 'center',
          }}
        />
      </svg>

      {/* Center content */}
      {(showValue || children) && (
        <div className="absolute flex flex-col items-center justify-center">
          {children ?? (
            <div className="text-4xl font-bold text-yellow-400">
              {value}%
            </div>
          )}
        </div>
      )}
    </div>
  );
};