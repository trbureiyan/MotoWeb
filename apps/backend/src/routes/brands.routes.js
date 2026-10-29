import { Router } from "express"
import { createBrand, listBrands, updateBrand } from "../controllers/brands.controller.js"
import { authRequired } from "../middlewares/validate.token.js"
import { adminRequired } from "../middlewares/role.middleware.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const router = Router()
router.get("/", asyncHandler(listBrands))
router.post("/", authRequired, adminRequired, asyncHandler(createBrand))
router.patch("/:id", authRequired, adminRequired, asyncHandler(updateBrand))

export default router
