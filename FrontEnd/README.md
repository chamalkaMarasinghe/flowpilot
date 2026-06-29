# FlowPilot

A modern, frontend-only team workflow & task management SaaS UI built with React, TypeScript, Vite, Tailwind CSS, Redux Toolkit, and TanStack Router. All data is mocked in-memory so the UI can later be wired to a real backend by swapping the service layer.

## Tech stack

- React 19 + TypeScript
- Vite + TanStack Start (TanStack Router)
- Tailwind CSS v4
- Redux Toolkit + `createAsyncThunk`
- shadcn/ui components + sonner toasts
- date-fns

> Note: This app uses TanStack Router with file-based routing in `src/routes/`.

## Features

- Mock authentication (login / register / forgot password) with localStorage persistence
- Role-based access (ADMIN / USER) and protected routes
- Task CRUD, status workflow (Open → In Progress → Testing → Done)
- Table and Card views, search/filter/sort
- Drag-and-drop Kanban board
- Admin User management (search, filter, activate/deactivate, change role)
- Dashboard with stat cards, status & priority breakdowns, recent activity, upcoming tasks
- Profile and Settings pages
- Responsive sidebar + mobile nav, professional SaaS styling

## Folder structure

```
src/
  app/                  Redux store and typed hooks
  components/
    common/             Logo, PageHeader, EmptyState, LoadingSpinner
    layout/             AppLayout, AuthLayout, ProtectedLayout
    tasks/              TaskCard, TaskTable, TaskForm, TaskFilters, badges, KanbanBoard
    users/              UserRoleBadge, UserStatusBadge
    dashboard/          StatCard
    ui/                 shadcn primitives
  config/env.ts         VITE_* configuration
  features/
    auth/  tasks/  users/  ui/    slice + thunks + types per feature
  mock/                 users / tasks / activity / dashboard mock data
  routes/               File-based TanStack routes (pages)
  services/             mockApi, authService, taskService, userService
  types/                Shared TS types and enums
  utils/                dateUtils, taskUtils, validationUtils
```

## Environment variables

Copy `.env.example` to `.env`:

```
VITE_APP_NAME=FlowPilot
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ENABLE_MOCK_API=true
```

Consumed via `src/config/env.ts`.

## Demo credentials

| Role  | Email                 | Password   |
| ----- | --------------------- | ---------- |
| Admin | admin@flowpilot.com   | Admin@123  |
| User  | user@flowpilot.com    | User@123   |
| User  | jane@flowpilot.com    | User@123   |

The login screen shows these inline; click to autofill.

## Install & run

```
bun install        # or npm install
bun run dev        # start the dev server
bun run build      # production build
```