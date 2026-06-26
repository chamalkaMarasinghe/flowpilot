import { useMemo, useState, type CSSProperties } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCorners,
  pointerWithin,
  MeasuringStrategy,
  type CollisionDetection,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import type { Task, TaskStatus, User } from "@/types";
import { ALL_STATUSES, STATUS_LABEL } from "@/utils/taskUtils";
import { TaskCard } from "./TaskCard";
import { useAppDispatch } from "@/app/hooks";
import { updateTask } from "@/features/tasks/taskThunks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  tasks: Task[];
  users: User[];
}

const COLUMN_ACCENT: Record<TaskStatus, string> = {
  OPEN: "before:bg-muted-foreground/40",
  IN_PROGRESS: "before:bg-info",
  TESTING: "before:bg-warning",
  DONE: "before:bg-success",
};

const isColumnId = (id: string | number | undefined): id is TaskStatus =>
  typeof id === "string" && (ALL_STATUSES as string[]).includes(id);

const pointerFirstCollisionDetection: CollisionDetection = (args) => {
  if (args.pointerCoordinates) {
    return pointerWithin(args);
  }

  return closestCorners(args);
};

export function KanbanBoard({ tasks, users }: Props) {
  const dispatch = useAppDispatch();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<TaskStatus | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const byStatus = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { OPEN: [], IN_PROGRESS: [], TESTING: [], DONE: [] };
    for (const t of tasks) map[t.status].push(t);
    return map;
  }, [tasks]);

  const active = activeId ? tasks.find((t) => t.id === activeId) ?? null : null;

  const findColumnOfTask = (taskId: string): TaskStatus | null => {
    const t = tasks.find((x) => x.id === taskId);
    return t ? t.status : null;
  };

  const resolveColumn = (id: string | number | undefined): TaskStatus | null => {
    if (id == null) return null;
    if (isColumnId(id)) return id;
    return findColumnOfTask(String(id));
  };

  const onDragStart = (e: DragStartEvent) => {
    setActiveId(String(e.active.id));
    setOverColumn(findColumnOfTask(String(e.active.id)));
  };

  const onDragOver = (e: DragOverEvent) => {
    const col = resolveColumn(e.over?.id);
    setOverColumn(col);
  };

  const onDragEnd = (e: DragEndEvent) => {
    const id = String(e.active.id);
    const destCol = resolveColumn(e.over?.id);
    setActiveId(null);
    setOverColumn(null);
    if (!destCol) return;
    const task = tasks.find((t) => t.id === id);
    if (!task || task.status === destCol) return;
    void dispatch(updateTask({ id, req: { status: destCol } })).then(() =>
      toast.success(`Moved to ${STATUS_LABEL[destCol]}`),
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerFirstCollisionDetection}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={() => {
        setActiveId(null);
        setOverColumn(null);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {ALL_STATUSES.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={byStatus[status]}
            users={users}
            isOver={overColumn === status}
            accent={COLUMN_ACCENT[status]}
          />
        ))}
      </div>

      <DragOverlay
        modifiers={[snapCenterToCursor]}
        className="cursor-grabbing"
        dropAnimation={{
          duration: 260,
          easing: "cubic-bezier(0.2, 0, 0, 1)",
        }}
      >
        {active ? (
          <TaskCard task={active} users={users} interactive={false} isDragPreview />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function Column({
  status,
  tasks,
  users,
  isOver,
  accent,
}: {
  status: TaskStatus;
  tasks: Task[];
  users: User[];
  isOver: boolean;
  accent: string;
}) {
  const { setNodeRef } = useDroppable({ id: status });
  const ids = useMemo(() => tasks.map((t) => t.id), [tasks]);

  return (
    <div
      ref={setNodeRef}
      data-kanban-column
      data-status={status}
      className={cn(
        "relative flex flex-col rounded-xl border bg-muted/30 p-3 transition-colors duration-200",
        "before:absolute before:left-0 before:top-0 before:h-1 before:w-full before:rounded-t-xl",
        accent,
        isOver && "border-primary/60 bg-primary/5 ring-2 ring-primary/30",
      )}
    >
      <div className="mb-3 flex items-center justify-between px-1 pt-1">
        <h3 className="text-sm font-semibold tracking-tight">{STATUS_LABEL[status]}</h3>
        <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {tasks.length}
        </span>
      </div>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="flex min-h-[120px] flex-col gap-3">
          {tasks.map((task) => (
            <SortableCard key={task.id} task={task} users={users} />
          ))}
          {tasks.length === 0 && (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-muted-foreground/20 py-8 text-xs text-muted-foreground">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

function SortableCard({ task, users }: { task: Task; users: User[] }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : (transition ?? "transform 180ms cubic-bezier(0.2, 0, 0, 1)"),
    visibility: isDragging ? "hidden" : "visible",
    willChange: "transform",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
    >
      <TaskCard task={task} users={users} />
    </div>
  );
}
