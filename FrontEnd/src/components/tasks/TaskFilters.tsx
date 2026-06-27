import type { TaskFilters as Filters, TaskPriority, TaskStatus, User } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_PRIORITIES, ALL_STATUSES, PRIORITY_LABEL, STATUS_LABEL } from "@/utils/taskUtils";
import { Search } from "lucide-react";

interface Props {
  filters: Filters;
  onChange: (next: Filters) => void;
  users: User[];
}

export function TaskFilters({ filters, onChange, users }: Props) {
  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search by title…"
          className="pl-9"
        />
      </div>
      <Select
        value={filters.status ?? "ALL"}
        onValueChange={(v) => onChange({ ...filters, status: v as TaskStatus | "ALL" })}
      >
        <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All statuses</SelectItem>
          {ALL_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.priority ?? "ALL"}
        onValueChange={(v) => onChange({ ...filters, priority: v as TaskPriority | "ALL" })}
      >
        <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All priorities</SelectItem>
          {ALL_PRIORITIES.map((p) => (
            <SelectItem key={p} value={p}>{PRIORITY_LABEL[p]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.assignedTo ?? "ALL"}
        onValueChange={(v) => onChange({ ...filters, assignedTo: v })}
      >
        <SelectTrigger><SelectValue placeholder="Assignee" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All assignees</SelectItem>
          {users.map((u) => (
            <SelectItem key={u.id} value={u.id}>{u.fullName}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
