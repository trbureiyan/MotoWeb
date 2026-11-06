import { Router } from "express";
import { listAdminPayments, simulateClientPayment } from "../controllers/payments.controller.js";
import { authRequired } from "../middlewares/validate.token.js";
import { adminRequired, requireRole } from "../middlewares/role.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.get("/", authRequired, adminRequired, asyncHandler(listAdminPayments));
router.post("/:appointmentId/simulate", authRequired, requireRole("client"), asyncHandler(simulateClientPayment));

export default router;
