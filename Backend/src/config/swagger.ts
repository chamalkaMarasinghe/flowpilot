import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env.js";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "FlowPilot API",
      version: "1.0.0",
      description:
        "REST API for FlowPilot task management. All responses use a uniform envelope: `{ success, message, data, errors? }`.",
    },
    servers: [{ url: `http://localhost:${env.PORT}/api`, description: "Development" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { nullable: true },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        AuthUser: {
          type: "object",
          properties: {
            id: { type: "string" },
            fullName: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["ADMIN", "USER"] },
            avatarUrl: { type: "string" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            user: { $ref: "#/components/schemas/AuthUser" },
            token: { type: "string" },
          },
        },
        Task: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
            status: { type: "string", enum: ["OPEN", "IN_PROGRESS", "TESTING", "DONE"] },
            dueDate: { type: "string", format: "date-time" },
            createdBy: { type: "string" },
            assignedTo: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            fullName: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["ADMIN", "USER"] },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE"] },
            avatarUrl: { type: "string" },
            jobTitle: { type: "string" },
            department: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
