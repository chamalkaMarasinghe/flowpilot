import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MyTasksPanel } from "@/components/dashboard/MyTasksPanel";
import { TaskStatusDonut } from "@/components/dashboard/TaskStatusDonut";
import { TasksTrendChart } from "@/components/dashboard/TasksTrendChart";
import { StatusPipelinePanel } from "@/components/dashboard/StatusPipelinePanel";
import { DueSoonPanel } from "@/components/dashboard/DueSoonPanel";
import { PriorityFeedPanel } from "@/components/dashboard/PriorityFeedPanel";
import { fetchDashboard } from "@/features/dashboard/dashboardThunks";
import { setPeriod, setTaskFocus } from "@/features/dashboard/dashboardSlice";
import type { DashboardPeriod, TaskFocus } from "@/types";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — FlowPilot" }] }),
  component: () => (
    <ProtectedLayout>
      <DashboardPage />
    </ProtectedLayout>
  ),
});

function DashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user)!;
  const users = useAppSelector((s) => s.users.items);
  const { data, loading, period, taskFocus } = useAppSelector((s) => s.dashboard);

  useEffect(() => {
    void dispatch(fetchDashboard({ period, taskFocus }));
  }, [dispatch, period, taskFocus]);

  const onPeriodChange = (p: DashboardPeriod) => dispatch(setPeriod(p));
  const onFocusChange = (f: TaskFocus) => dispatch(setTaskFocus(f));

  const roleLabel = user.role === "ADMIN" ? "Administrator overview" : "Your workspace";

  if (loading && !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data) return null;

  const filteredCount =
    data.statusChart.reduce((sum, row) => sum + row.value, 0) || data.summary.totalTasks;

  return (
    <div className="dashboard-shell space-y-6 pb-2">
      <DashboardHeader
        firstName={user.fullName.split(" ")[0]}
        roleLabel={roleLabel}
        period={period}
        onPeriodChange={onPeriodChange}
        completionRate={data.completionRate}
        totalTasks={data.summary.totalTasks}
        overdueCount={data.summary.overdueTasks}
      />

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <MyTasksPanel
            tasks={data.myTasks}
            users={users}
            focus={taskFocus}
            onFocusChange={onFocusChange}
          />
        </div>

        <div className="space-y-5 xl:col-span-5">
          <TaskStatusDonut data={data.statusChart} total={filteredCount} />
          <TasksTrendChart data={data.trend} />
          <StatusPipelinePanel rows={data.pipeline} />
        </div>

        <div className="space-y-5 xl:col-span-3">
          <DueSoonPanel tasks={data.dueSoon} />
          <PriorityFeedPanel urgentTasks={data.urgent} activity={data.recentActivity} users={users} />
        </div>
      </div>
    </div>
  );
}
