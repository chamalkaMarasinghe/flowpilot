import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  withWordmark?: boolean;
  size?: number;
}

export function Logo({ className, withWordmark = true, size = 28 }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="FlowPilot logo"
      >
        <defs>
          <linearGradient id="fp-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4f7bff" />
            <stop offset="55%" stopColor="#7b5cff" />
            <stop offset="100%" stopColor="#b558ff" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#fp-grad)" />
        {/* paper plane through nodes */}
        <circle cx="11" cy="29" r="2.2" fill="white" fillOpacity="0.95" />
        <circle cx="29" cy="11" r="2.2" fill="white" fillOpacity="0.95" />
        <path
          d="M11 29 L20 20 L29 11"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="2 2.5"
          opacity="0.7"
        />
        <path
          d="M14 22 L28 16 L22 26 L20.5 21.5 L14 22 Z"
          fill="white"
        />
      </svg>
      {withWordmark && (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Flow<span className="text-brand-gradient">Pilot</span>
        </span>
      )}
    </div>
  );
}
