export type UserRole = "ADMIN" | "USER";
export type UserStatus = "ACTIVE" | "INACTIVE";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  jobTitle?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "OPEN" | "IN_PROGRESS" | "TESTING" | "DONE";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdBy: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskWithRelations extends Task {
  createdByUser?: User;
  assignedToUser?: User;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assignedTo: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  assignedTo?: string;
}

export interface TaskFilters {
  search: string;
  priority?: TaskPriority | "ALL";
  status?: TaskStatus | "ALL";
  assignedTo?: string | "ALL";
  createdBy?: string | "ALL";
  dueFrom?: string;
  dueTo?: string;
}

export type ActivityType =
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_DELETED"
  | "STATUS_CHANGED"
  | "TASK_ASSIGNED"
  | "USER_LOGIN";

export interface ActivityLog {
  id: string;
  type: ActivityType;
  message: string;
  taskId?: string;
  userId: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalTasks: number;
  openTasks: number;
  inProgressTasks: number;
  testingTasks: number;
  doneTasks: number;
  overdueTasks: number;
  assignedToMe: number;
  highPriorityTasks: number;
}

export type DashboardPeriod = "today" | "week" | "month" | "all";
export type TaskFocus = "today" | "upcoming";

export interface StatusChartDatum {
  status: TaskStatus;
  label: string;
  value: number;
  fill: string;
}

export interface TrendDatum {
  label: string;
  created: number;
  completed: number;
}

export interface PipelineRow {
  status: TaskStatus;
  label: string;
  count: number;
  percent: number;
  color: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  completionRate: number;
  statusChart: StatusChartDatum[];
  trend: TrendDatum[];
  pipeline: PipelineRow[];
  myTasks: Task[];
  dueSoon: Task[];
  urgent: Task[];
  recentActivity: ActivityLog[];
  period: DashboardPeriod;
  taskFocus: TaskFocus;
}

export type TaskSortKey = "dueDate" | "priority" | "status" | "createdAt";

export interface TaskListQuery {
  search?: string;
  status?: TaskStatus | "ALL";
  priority?: TaskPriority | "ALL";
  assignedTo?: string | "ALL";
  sort?: TaskSortKey;
}

export interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  tableView: "table" | "card";
}
