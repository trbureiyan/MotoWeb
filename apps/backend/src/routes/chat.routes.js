import { Router } from "express";
import { listContactRequests, respondToChat, updateContactRequest } from "../controllers/chat.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authRequired } from "../middlewares/validate.token.js";
import { adminRequired } from "../middlewares/role.middleware.js";

const router = Router();
router.post("/message", asyncHandler(respondToChat));
router.get("/requests", authRequired, adminRequired, asyncHandler(listContactRequests));
router.patch("/requests/:id", authRequired, adminRequired, asyncHandler(updateContactRequest));

export default router;
