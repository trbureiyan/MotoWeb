import { Router } from "express";
import { listReviews, createReview, updateReview, deleteReview } from "../controllers/reviews.controller.js";
import { authRequired } from "../middlewares/validate.token.js";
import { adminRequired } from "../middlewares/role.middleware.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", optionalAuth, asyncHandler(listReviews));
router.post("/", authRequired, asyncHandler(createReview));
router.patch("/:id", authRequired, adminRequired, asyncHandler(updateReview));
router.delete("/:id", authRequired, adminRequired, asyncHandler(deleteReview));

export default router;
