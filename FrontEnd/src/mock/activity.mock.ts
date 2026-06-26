import type { ActivityLog } from "@/types";

const ago = (h: number) => new Date(Date.now() - h * 3600 * 1000).toISOString();

export const mockActivity: ActivityLog[] = [
  { id: "a1", type: "TASK_CREATED", message: "created task 'Design new dashboard layout'", taskId: "t1", userId: "u1", createdAt: ago(2) },
  { id: "a2", type: "STATUS_CHANGED", message: "moved 'Write API documentation' to Testing", taskId: "t3", userId: "u5", createdAt: ago(5) },
  { id: "a3", type: "TASK_ASSIGNED", message: "assigned 'Kanban drag-and-drop polish' to John User", taskId: "t6", userId: "u3", createdAt: ago(8) },
  { id: "a4", type: "TASK_UPDATED", message: "updated 'Onboard new team members'", taskId: "t5", userId: "u1", createdAt: ago(20) },
  { id: "a5", type: "USER_LOGIN", message: "signed in", userId: "u2", createdAt: ago(28) },
  { id: "a6", type: "TASK_CREATED", message: "created task 'Overdue: send Q2 report'", taskId: "t7", userId: "u1", createdAt: ago(40) },
];
