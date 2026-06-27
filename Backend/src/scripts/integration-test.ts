import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer, type Server } from "node:http";
import { connectDb } from "../config/db.js";
import { createApp } from "../app.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import type { ApiResponse } from "../utils/response.js";

async function seedForTest() {
  await Task.deleteMany({});
  await User.deleteMany({});

  const adminHash = await bcrypt.hash("Admin@123", 10);
  const userHash = await bcrypt.hash("User@123", 10);

  const admin = await User.create({
    fullName: "Alex Admin",
    email: "admin@flowpilot.com",
    passwordHash: adminHash,
    role: "ADMIN",
    status: "ACTIVE",
  });

  const user = await User.create({
    fullName: "John User",
    email: "user@flowpilot.com",
    passwordHash: userHash,
    role: "USER",
    status: "ACTIVE",
  });

  await Task.create({
    title: "Test task",
    description: "Integration test task",
    priority: "HIGH",
    status: "OPEN",
    dueDate: new Date(Date.now() + 86400000),
    createdBy: admin._id,
    assignedTo: user._id,
  });

  return { admin, user };
}

async function request<T>(baseUrl: string, path: string, init?: RequestInit) {
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const body = (await res.json().catch(() => ({}))) as ApiResponse<T>;
  return { status: res.status, body };
}

async function run() {
  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  process.env.JWT_SECRET = "test-secret";
  process.env.CORS_ORIGIN = "http://localhost:8080";

  await connectDb(mongoUri);
  await seedForTest();

  const app = createApp();
  let server: Server | undefined;
  const baseUrl = await new Promise<string>((resolve) => {
    server = createServer(app).listen(0, () => {
      const addr = server!.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      resolve(`http://127.0.0.1:${port}`);
    });
  });

  try {
    const login = await request<{ user: { email: string }; token: string }>(baseUrl, "/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "admin@flowpilot.com", password: "Admin@123" }),
    });
    if (login.status !== 200 || !login.body.success || !login.body.data?.token) {
      throw new Error(`Login failed: ${JSON.stringify(login.body)}`);
    }

    const token = login.body.data.token;
    const authHeaders = { Authorization: `Bearer ${token}` };

    const me = await request<{ user: { email: string } }>(baseUrl, "/api/auth/me", { headers: authHeaders });
    if (me.status !== 200 || !me.body.success || me.body.data?.user.email !== "admin@flowpilot.com") {
      throw new Error(`Me endpoint failed: ${JSON.stringify(me.body)}`);
    }

    const tasks = await request<unknown[]>(baseUrl, "/api/tasks", { headers: authHeaders });
    if (tasks.status !== 200 || !tasks.body.success || !Array.isArray(tasks.body.data) || tasks.body.data.length === 0) {
      throw new Error(`Tasks fetch failed: ${JSON.stringify(tasks.body)}`);
    }

    const users = await request<unknown[]>(baseUrl, "/api/users", { headers: authHeaders });
    if (users.status !== 200 || !users.body.success || !Array.isArray(users.body.data) || users.body.data.length < 2) {
      throw new Error(`Users fetch failed: ${JSON.stringify(users.body)}`);
    }

    const userLogin = await request<{ token: string }>(baseUrl, "/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "user@flowpilot.com", password: "User@123" }),
    });
    const userToken = userLogin.body.data!.token;
    const scopedTasks = await request<unknown[]>(baseUrl, "/api/tasks", {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    if (scopedTasks.status !== 200 || !scopedTasks.body.success) {
      throw new Error(`Scoped tasks failed: ${JSON.stringify(scopedTasks.body)}`);
    }

    const badLogin = await request<null>(baseUrl, "/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "admin@flowpilot.com", password: "wrong" }),
    });
    if (badLogin.status !== 401 || badLogin.body.success !== false) {
      throw new Error(`Expected 401 on bad login: ${JSON.stringify(badLogin.body)}`);
    }

    console.log("Integration tests passed");
    console.log(`- Admin login + /me OK`);
    console.log(`- Tasks OK, ${tasks.body.data!.length} task(s)`);
    console.log(`- Users OK, ${users.body.data!.length} user(s)`);
    console.log(`- User scoped tasks OK, ${scopedTasks.body.data!.length} task(s)`);
    console.log(`- Error envelope OK on invalid login`);
  } finally {
    server?.close();
    await mongoose.disconnect();
    await mongo.stop();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
