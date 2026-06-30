import { Router } from "express";
import { register, login, refresh, logout } from "../controllers/auth.controller.js";
import { googleAuth } from "../controllers/oauth.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import { registerSchema, loginSchema, googleAuthSchema } from "../validators/auth.schema.js";
import profileRoutes from "./profile.routes.js";
import verificationRoutes from "./verification.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.post("/register", validate({ body: registerSchema }), register);
router.post("/login", validate({ body: loginSchema }), login);
router.post("/google", validate({ body: googleAuthSchema }), googleAuth);
router.post("/refresh", refresh);
router.post("/logout", authenticate, logout);

router.use("/profile", profileRoutes);
router.use("/", verificationRoutes);
router.use("/admin/users", adminRoutes);

export default router;
