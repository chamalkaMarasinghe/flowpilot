import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Loader2 } from "lucide-react";
import { taskService } from "@/services/taskService";
import type { Task } from "@/types";
import { STATUS_LABEL } from "@/utils/taskUtils";
import { cn } from "@/lib/utils";

export function GlobalTaskSearch() {
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setLoading(true);
      void taskService
        .searchTasks(trimmed)
        .then((tasks) => {
          setResults(tasks);
          setOpen(true);
          setActiveIndex(-1);
        })
        .catch(() => {
          setResults([]);
          setOpen(true);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const goToTasksList = (q: string) => {
    setOpen(false);
    void navigate({ to: "/tasks", search: { q } });
  };

  const goToTask = (id: string) => {
    setQuery("");
    setOpen(false);
    void navigate({ to: "/tasks/$id", params: { id } });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    if (activeIndex >= 0 && results[activeIndex]) {
      goToTask(results[activeIndex].id);
      return;
    }
    goToTasksList(q);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) {
      if (e.key === "Escape") setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={wrapRef} className="relative min-w-0 flex-1 max-w-md">
      <form onSubmit={onSubmit} role="search">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search tasks by name…"
          aria-label="Search tasks by name"
          aria-expanded={showDropdown}
          aria-controls="global-task-search-results"
          aria-autocomplete="list"
          autoComplete="off"
          className="h-9 w-full rounded-md border border-input bg-background/60 pl-9 pr-9 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
        {loading && (
          <Loader2
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
            aria-hidden
          />
        )}
      </form>

      {showDropdown && (
        <div
          id="global-task-search-results"
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-72 overflow-y-auto rounded-md border bg-popover py-1 text-popover-foreground shadow-md"
        >
          {loading && results.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">Searching…</p>
          ) : results.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">No tasks found</p>
          ) : (
            results.map((task, index) => (
              <button
                key={task.id}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => goToTask(task.id)}
                className={cn(
                  "flex w-full flex-col gap-0.5 px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
                  index === activeIndex && "bg-accent",
                )}
              >
                <span className="font-medium">{task.title}</span>
                <span className="text-xs text-muted-foreground">{STATUS_LABEL[task.status]}</span>
              </button>
            ))
          )}
          {!loading && query.trim() && (
            <button
              type="button"
              onClick={() => goToTasksList(query.trim())}
              className="w-full border-t px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              View all results for &ldquo;{query.trim()}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
