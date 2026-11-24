import { Router } from "express";
import { listClientNotifications, markClientNotificationRead } from "../controllers/notifications.controller.js";
import { authRequired } from "../middlewares/validate.token.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.get("/", authRequired, requireRole("client"), asyncHandler(listClientNotifications));
router.patch("/:id/read", authRequired, requireRole("client"), asyncHandler(markClientNotificationRead));

export default router;
