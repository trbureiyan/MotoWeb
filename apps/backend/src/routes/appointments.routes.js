import { Router } from "express"
import { createAppointment, createChainAppointment, listAppointments, listClientAppointments, updateAppointment } from "../controllers/appointments.controller.js"
import { authRequired } from "../middlewares/validate.token.js"
import { adminRequired, requireRole } from "../middlewares/role.middleware.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const router = Router()
router.get("/mine", authRequired, requireRole("client"), asyncHandler(listClientAppointments))
router.get("/", authRequired, adminRequired, asyncHandler(listAppointments))
router.post("/", authRequired, requireRole("client"), asyncHandler(createAppointment))
router.post("/:id/chain", authRequired, requireRole("client"), asyncHandler(createChainAppointment))
router.patch("/:id", authRequired, adminRequired, asyncHandler(updateAppointment))

export default router
