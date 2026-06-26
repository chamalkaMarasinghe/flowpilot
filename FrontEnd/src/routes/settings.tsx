import { createFileRoute } from "@tanstack/react-router";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setSidebar, setTableView } from "@/features/ui/uiSlice";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

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
  const dispatch = useAppDispatch();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Settings" description="Personal preferences for your workspace." />

      <Card className="divide-y p-0">
        <Row label="Sidebar open by default" hint="Show the sidebar expanded on load.">
          <Switch checked={ui.sidebarOpen} onCheckedChange={(c) => dispatch(setSidebar(c))} />
        </Row>
        <Row label="Default task view" hint="Choose your preferred layout for the tasks page.">
          <Select value={ui.tableView} onValueChange={(v) => dispatch(setTableView(v as "table" | "card"))}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="table">Table</SelectItem>
              <SelectItem value="card">Cards</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Row label="Email notifications" hint="Receive updates for tasks assigned to you.">
          <Switch defaultChecked />
        </Row>
        <Row label="Weekly digest" hint="A summary of your team's progress every Monday.">
          <Switch />
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
