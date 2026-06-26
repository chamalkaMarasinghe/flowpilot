import type { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAppSelector } from "@/app/hooks";
import { Logo } from "@/components/common/Logo";

export function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const user = useAppSelector((s) => s.auth.user);
  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-gradient p-10 text-white lg:flex">
        <Logo withWordmark />
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-semibold leading-tight">
            Pilot your team's workflow with confidence.
          </h2>
          <p className="mt-4 text-white/85">
            FlowPilot turns scattered to-dos into a clear, shared plan — from intake to delivery.
          </p>
        </div>
        <ul className="relative z-10 space-y-2 text-sm text-white/85">
          <li>✓ Kanban + table views</li>
          <li>✓ Role-based access</li>
          <li>✓ Realtime activity & dashboard insights</li>
        </ul>
        <div className="pointer-events-none absolute -right-32 -top-32 size-[420px] rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 size-[360px] rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
