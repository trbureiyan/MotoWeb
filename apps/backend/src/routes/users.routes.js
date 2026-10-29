import { Router } from "express"
import { listUsers, updateUser } from "../controllers/users.controller.js"
import { authRequired } from "../middlewares/validate.token.js"
import { adminRequired } from "../middlewares/role.middleware.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const router = Router()
router.get("/", authRequired, adminRequired, asyncHandler(listUsers))
router.patch("/:id", authRequired, adminRequired, asyncHandler(updateUser))

export default router
