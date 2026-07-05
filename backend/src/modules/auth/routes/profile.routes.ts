import { Router } from "express";
import { getProfile, updateProfile, changePassword } from "../controllers/profile.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import { changePasswordSchema } from "../validators/auth.schema.js";

const router = Router();

router.get("/", authenticate, getProfile);
router.put("/", authenticate, updateProfile);
router.put("/password", authenticate, validate({ body: changePasswordSchema }), changePassword);

export default router;
