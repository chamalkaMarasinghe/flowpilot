import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { useAppSelector } from "@/app/hooks";
import { computeSummary } from "@/utils/taskUtils";
import { mockActivity } from "@/mock/activity.mock";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MyTasksPanel } from "@/components/dashboard/MyTasksPanel";
import { TaskStatusDonut } from "@/components/dashboard/TaskStatusDonut";
import { TasksTrendChart } from "@/components/dashboard/TasksTrendChart";
import { StatusPipelinePanel } from "@/components/dashboard/StatusPipelinePanel";
import { DueSoonPanel } from "@/components/dashboard/DueSoonPanel";
import { PriorityFeedPanel } from "@/components/dashboard/PriorityFeedPanel";
import {
  type DashboardPeriod,
  type TaskFocus,
  filterMyTasks,
  filterTasksByPeriod,
  getCompletionRate,
  getDueSoonTasks,
  getStatusChartData,
  getStatusPipeline,
  getTasksTrendData,
  getUrgentTasks,
  recentActivity,
} from "@/utils/dashboardUtils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — FlowPilot" }] }),
  component: () => (
    <ProtectedLayout>
      <DashboardPage />
    </ProtectedLayout>
  ),
});

function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user)!;
  const allTasks = useAppSelector((s) => s.tasks.items);
  const users = useAppSelector((s) => s.users.items);

  const [period, setPeriod] = useState<DashboardPeriod>("month");
  const [taskFocus, setTaskFocus] = useState<TaskFocus>("today");

  const scoped = useMemo(
    () =>
      user.role === "ADMIN"
        ? allTasks
        : allTasks.filter((t) => t.createdBy === user.id || t.assignedTo === user.id),
    [allTasks, user.id, user.role],
  );

  const filtered = useMemo(() => filterTasksByPeriod(scoped, period), [scoped, period]);
  const summary = useMemo(() => computeSummary(filtered, user.id), [filtered, user.id]);

  const myTasks = useMemo(
    () => filterMyTasks(scoped, user.id, taskFocus),
    [scoped, user.id, taskFocus],
  );

  const statusChart = useMemo(() => getStatusChartData(filtered), [filtered]);
  const trendData = useMemo(() => getTasksTrendData(scoped), [scoped]);
  const pipeline = useMemo(() => getStatusPipeline(filtered), [filtered]);
  const dueSoon = useMemo(() => getDueSoonTasks(filtered), [filtered]);
  const urgent = useMemo(() => getUrgentTasks(filtered), [filtered]);
  const activity = useMemo(() => recentActivity(mockActivity), []);

  const roleLabel = user.role === "ADMIN" ? "Administrator overview" : "Your workspace";

  return (
    <div className="dashboard-shell space-y-6 pb-2">
      <DashboardHeader
        firstName={user.fullName.split(" ")[0]}
        roleLabel={roleLabel}
        period={period}
        onPeriodChange={setPeriod}
        completionRate={getCompletionRate(filtered)}
        totalTasks={summary.totalTasks}
        overdueCount={summary.overdueTasks}
      />

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <MyTasksPanel
            tasks={myTasks}
            users={users}
            focus={taskFocus}
            onFocusChange={setTaskFocus}
          />
        </div>

        <div className="space-y-5 xl:col-span-5">
          <TaskStatusDonut data={statusChart} total={filtered.length} />
          <TasksTrendChart data={trendData} />
          <StatusPipelinePanel rows={pipeline} />
        </div>

        <div className="space-y-5 xl:col-span-3">
          <DueSoonPanel tasks={dueSoon} />
          <PriorityFeedPanel urgentTasks={urgent} activity={activity} users={users} />
        </div>
      </div>
    </div>
  );
}
