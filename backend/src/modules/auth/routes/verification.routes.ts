import { Router } from "express";
import { verifyEmail, resendVerification, forgotPassword, resetPassword } from "../controllers/verification.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import { verifyEmailSchema, forgotPasswordSchema, resetPasswordSchema } from "../validators/auth.schema.js";

const router = Router();

router.post("/verify-email", validate({ body: verifyEmailSchema }), verifyEmail);
router.post("/resend-verification", authenticate, resendVerification);
router.post("/forgot-password", validate({ body: forgotPasswordSchema }), forgotPassword);
router.post("/reset-password", validate({ body: resetPasswordSchema }), resetPassword);

export default router;
