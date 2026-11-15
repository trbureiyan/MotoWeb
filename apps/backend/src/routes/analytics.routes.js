// Rutas /api/analytics
import { Router } from "express";
import { z } from "zod";
import { recordView, getSummary, runRollup } from "../controllers/analytics.controller.js";
import { authRequired } from "../middlewares/validate.token.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const viewSchema = z.object({
    section: z.string().trim().min(1).max(60),
    event: z.string().trim().min(1).max(60)
});

const router = Router();

// Captura pública (visitas anónimas y autenticadas).
router.post("/views", optionalAuth, validateSchema(viewSchema), asyncHandler(recordView));
// Lectura y consolidación: solo administradores.
router.get("/summary", authRequired, requireRole("admin"), asyncHandler(getSummary));
router.post("/rollup", authRequired, requireRole("admin"), asyncHandler(runRollup));

export default router;
