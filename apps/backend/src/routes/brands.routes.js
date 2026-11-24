import { Router } from "express"
import { createBrand, listBrands, updateBrand } from "../controllers/brands.controller.js"
import { createBrandRequest, listBrandRequests, reviewBrandRequest } from "../controllers/brandRequests.controller.js"
import { authRequired } from "../middlewares/validate.token.js"
import { adminRequired, requireRole } from "../middlewares/role.middleware.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const router = Router()
router.get("/", asyncHandler(listBrands))
router.post("/requests", authRequired, requireRole("client"), asyncHandler(createBrandRequest))
router.get("/requests", authRequired, adminRequired, asyncHandler(listBrandRequests))
router.patch("/requests/:id", authRequired, adminRequired, asyncHandler(reviewBrandRequest))
router.post("/", authRequired, adminRequired, asyncHandler(createBrand))
router.patch("/:id", authRequired, adminRequired, asyncHandler(updateBrand))

export default router
