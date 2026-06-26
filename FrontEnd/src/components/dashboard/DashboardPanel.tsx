import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function DashboardPanel({ title, action, children, className, bodyClassName }: Props) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-primary/10 bg-card/90 p-5 shadow-soft backdrop-blur-sm",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold tracking-tight text-primary">{title}</h2>
        {action}
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
