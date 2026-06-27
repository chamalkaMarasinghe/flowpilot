import { createFileRoute } from "@tanstack/react-router";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppSelector } from "@/app/hooks";
import { useUpdatePreferences } from "@/hooks/useUpdatePreferences";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Moon, Sun } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — FlowPilot" }] }),
  component: () => (
    <ProtectedLayout>
      <SettingsPage />
    </ProtectedLayout>
  ),
});

function SettingsPage() {
  const ui = useAppSelector((s) => s.ui);
  const savePreferences = useUpdatePreferences();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Settings" description="Personal preferences for your workspace." />

      <Card className="divide-y p-0">
        <Row label="Appearance" hint="Choose light or dark mode for the interface.">
          <Select
            value={ui.theme}
            onValueChange={(v) => void savePreferences({ theme: v as "light" | "dark" })}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <span className="flex items-center gap-2">
                  <Sun className="size-4" /> Light
                </span>
              </SelectItem>
              <SelectItem value="dark">
                <span className="flex items-center gap-2">
                  <Moon className="size-4" /> Dark
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Row
          label="Sidebar open by default"
          hint="When off, use the floating button (or sidebar control) to show or hide navigation."
        >
          <Switch
            checked={ui.sidebarOpen}
            onCheckedChange={(c) => void savePreferences({ sidebarOpen: c })}
          />
        </Row>
        <Row label="Default task view" hint="Choose your preferred layout for the tasks page.">
          <Select
            value={ui.tableView}
            onValueChange={(v) => void savePreferences({ tableView: v as "table" | "card" })}
          >
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="table">Table</SelectItem>
              <SelectItem value="card">Cards</SelectItem>
            </SelectContent>
          </Select>
        </Row>
      </Card>
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 p-5">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}
