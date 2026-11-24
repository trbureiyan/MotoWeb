import { Router } from "express"
import { createService, listServices, updateService } from "../controllers/services.controller.js"
import { authRequired } from "../middlewares/validate.token.js"
import { adminRequired } from "../middlewares/role.middleware.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const router = Router()
router.get("/", asyncHandler(listServices))
router.post("/", authRequired, adminRequired, asyncHandler(createService))
router.patch("/:id", authRequired, adminRequired, asyncHandler(updateService))

export default router
