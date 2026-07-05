import { Router } from "express";
import { listUsers, createUser, getUser, updateUser, deleteUser } from "../controllers/admin.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import { requireRole } from "../../../middleware/rbac.js";
import { validate } from "../../../middleware/validate.js";
import { registerSchema } from "../validators/auth.schema.js";

const router = Router();

router.use(authenticate, requireRole("SuperAdmin", "ClinicAdmin"));

router.get("/", listUsers);
router.post("/", validate({ body: registerSchema }), createUser);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
