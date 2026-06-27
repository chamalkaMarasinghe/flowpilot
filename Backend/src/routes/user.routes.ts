import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List all users (for assignee selection)
 *     security: [{ bearerAuth: [] }]
 */
router.get("/", userController.listUsers);

/**
 * @openapi
 * /users/{id}/status:
 *   patch:
 *     tags: [Users]
 *     summary: Activate or deactivate a user (admin only)
 *     security: [{ bearerAuth: [] }]
 */
router.patch("/:id/status", requireAdmin, userController.setStatus);

/**
 * @openapi
 * /users/{id}/role:
 *   patch:
 *     tags: [Users]
 *     summary: Change user role (admin only)
 *     security: [{ bearerAuth: [] }]
 */
router.patch("/:id/role", requireAdmin, userController.setRole);

export default router;
