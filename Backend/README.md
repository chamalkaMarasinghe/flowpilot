# FlowPilot API

REST API for the FlowPilot task-management application. Built with **Express**, **MongoDB** (Mongoose), and **JWT** authentication. All JSON responses use a uniform envelope:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": {},
  "errors": []
}
```

Interactive API documentation is available at `/api/docs` when the server is running.

---

## Dependencies

### Runtime

| Package | Purpose |
|---------|---------|
| [express](https://expressjs.com/) | HTTP server and routing |
| [mongoose](https://mongoosejs.com/) | MongoDB ODM |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | JWT session tokens |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [zod](https://zod.dev/) | Request/query validation |
| [cors](https://github.com/expressjs/cors) | Cross-origin requests |
| [helmet](https://helmetjs.github.io/) | Security headers |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variables |
| [date-fns](https://date-fns.org/) | Dashboard date utilities |
| [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) + [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) | OpenAPI docs |

### Development

| Package | Purpose |
|---------|---------|
| [typescript](https://www.typescriptlang.org/) | Type checking |
| [tsx](https://github.com/privatenumber/tsx) | Dev server and scripts |
| [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server) | In-memory DB for integration tests |
| `@types/*` | TypeScript definitions |

---

## Prerequisites

- **Node.js** 20+ (22 recommended)
- **npm** 9+
- **MongoDB** 6+ locally, or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

---

## Setup

### 1. Install dependencies

```bash
cd BackEnd
npm install
```

### 2. Configure environment

Copy the example file and edit values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | API port (default `5000`) |
| `MONGODB_URI` | Yes* | MongoDB connection string |
| `JWT_SECRET` | Yes* | Secret for signing JWTs — use a long random value in production |
| `JWT_EXPIRES_IN` | No | Token lifetime (default `7d`) |
| `CORS_ORIGIN` | No | Allowed frontend origin (default `http://localhost:8080`) |
| `NODE_ENV` | No | `development` or `production` |

\* Defaults exist for local development only. **Always set strong values in production.**

**Local MongoDB example:**

```env
MONGODB_URI=mongodb://127.0.0.1:27017/flowpilot
```

**MongoDB Atlas example:**

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/flowpilot
```

### 3. Seed the database (optional)

Populates demo users and sample tasks:

```bash
npm run seed
```

**Demo accounts:**

| Email | Password | Role |
|-------|----------|------|
| `admin@flowpilot.com` | `Admin@123` | Admin |
| `user@flowpilot.com` | `User@123` | User |

> `npm run seed` **deletes all existing users and tasks** in the connected database.

### 4. Start the server

**Development** (watch mode):

```bash
npm run dev
```

**Production build:**

```bash
npm run build
npm start
```

The API listens on `http://localhost:5000` by default.

---

## Usage

### Health check

```bash
curl http://localhost:5000/health
```

### Authentication

1. **Register** or **login** to receive a JWT.
2. Send the token on protected routes:

```http
Authorization: Bearer <token>
```

**Login example:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@flowpilot.com","password":"Admin@123"}'
```

Response `data` includes `user` and `token`. Use `token` in the `Authorization` header for subsequent requests.

**Session / current user:**

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### API base path

All application routes are under `/api`:

| Area | Base path |
|------|-----------|
| Auth | `/api/auth` |
| Tasks | `/api/tasks` |
| Search | `/api/search` |
| Dashboard | `/api/dashboard` |
| Users | `/api/users` |

### Swagger UI

| URL | Description |
|-----|-------------|
| `http://localhost:5000/api/docs` | Interactive API explorer |
| `http://localhost:5000/api/docs.json` | OpenAPI JSON spec |

Use **Authorize** in Swagger UI and paste `Bearer <your-jwt>` to test protected endpoints.

### Main endpoints

#### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login |
| POST | `/api/auth/forgot-password` | — | Password reset stub |
| GET | `/api/auth/me` | JWT | Current user + preferences |
| PATCH | `/api/auth/me` | JWT | Update profile |
| PATCH | `/api/auth/me/preferences` | JWT | Update workspace settings |
| POST | `/api/auth/logout` | JWT | Logout (client discards token) |

**Preferences** (`PATCH /api/auth/me/preferences`): `sidebarOpen`, `tableView` (`table` \| `card`), `theme` (`light` \| `dark`).

#### Tasks

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/tasks` | JWT | List tasks (filter/sort query params) |
| POST | `/api/tasks` | JWT | Create task |
| GET | `/api/tasks/:id` | JWT | Get task |
| PATCH | `/api/tasks/:id` | JWT | Update task |
| DELETE | `/api/tasks/:id` | JWT | Delete task |

**List query params:** `search`, `status`, `priority`, `assignedTo`, `sort` (`dueDate` \| `priority` \| `status` \| `createdAt`).

**Authorization:** Admins see all tasks; users see tasks they created or are assigned to.

#### Search

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/search/tasks?q=` | JWT | Search tasks by title (case-insensitive) |

#### Dashboard

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/dashboard` | JWT | Summary, charts, my tasks, activity |

**Query params:** `period` (`today` \| `week` \| `month` \| `all`), `taskFocus` (`today` \| `upcoming`).

#### Users (admin)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/users` | JWT | List users (assignee dropdown) |
| PATCH | `/api/users/:id/status` | Admin | Activate/deactivate |
| PATCH | `/api/users/:id/role` | Admin | Change role |
| DELETE | `/api/users/:id` | Admin | Delete user and related tasks |

---

## npm scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `tsx watch src/index.ts` | Start dev server with hot reload |
| `build` | `tsc` | Compile TypeScript to `dist/` |
| `start` | `node dist/index.js` | Run compiled production server |
| `seed` | `tsx src/utils/seed.ts` | Reset and seed database |
| `test:api` | `tsx src/scripts/integration-test.ts` | Run integration tests (in-memory MongoDB) |

---

## Project structure

```text
BackEnd/
├── src/
│   ├── index.ts              # Entry point (connect DB, start server)
│   ├── app.ts                # Express app factory
│   ├── config/               # env, db, swagger
│   ├── controllers/          # Route handlers
│   ├── middleware/           # auth, errors, admin guard
│   ├── models/               # Mongoose schemas (User, Task)
│   ├── routes/               # API route definitions + OpenAPI comments
│   ├── services/             # Business logic
│   ├── utils/                # seed, response helpers, dashboard utils
│   └── scripts/
│       └── integration-test.ts
├── dist/                     # Compiled output (after build)
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Frontend integration

Point the FlowPilot frontend at this API:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Ensure `CORS_ORIGIN` matches the frontend URL (e.g. `http://localhost:8080` for local Vite dev).

The frontend stores the JWT in `localStorage` and sends it via the `Authorization` header. User preferences returned from `/api/auth/me` drive theme, sidebar, and default task view per user.

---

---

## Production notes

- Set `NODE_ENV=production` and a strong `JWT_SECRET`.
- Use MongoDB Atlas or a managed MongoDB instance; allow network access from your host.
- Set `CORS_ORIGIN` to your deployed frontend origin (exact match, no trailing slash).

---