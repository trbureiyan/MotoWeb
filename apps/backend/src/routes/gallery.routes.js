import { Router } from "express"
import { createGalleryImage, listGalleryImages } from "../controllers/gallery.controller.js"
import { adminRequired } from "../middlewares/role.middleware.js"
import { authRequired } from "../middlewares/validate.token.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const router = Router()
router.get("/", asyncHandler(listGalleryImages))
router.post("/", authRequired, adminRequired, asyncHandler(createGalleryImage))

export default router
