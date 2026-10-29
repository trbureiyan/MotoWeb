import { Router } from "express"
import { createAppointment, listAppointments, updateAppointment } from "../controllers/appointments.controller.js"
import { authRequired } from "../middlewares/validate.token.js"
import { adminRequired } from "../middlewares/role.middleware.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const router = Router()
router.get("/", authRequired, adminRequired, asyncHandler(listAppointments))
router.post("/", authRequired, asyncHandler(createAppointment))
router.patch("/:id", authRequired, adminRequired, asyncHandler(updateAppointment))

export default router
