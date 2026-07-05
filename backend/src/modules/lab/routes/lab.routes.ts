import { Router } from "express";
import { createLabOrder, getLabOrder, listLabOrders, updateLabOrder, reviewLabOrder } from "../controllers/lab.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import { requireRole } from "../../../middleware/rbac.js";
import { validate } from "../../../middleware/validate.js";
import { createLabOrderSchema, updateLabOrderSchema, reviewLabOrderSchema } from "../validators/lab.schema.js";

const router = Router();

router.use(authenticate);

router.get("/", requireRole("SuperAdmin", "ClinicAdmin", "Doctor", "LabTechnician"), listLabOrders);
router.get("/:id", requireRole("SuperAdmin", "ClinicAdmin", "Doctor", "LabTechnician", "Nurse"), getLabOrder);
router.post("/", requireRole("SuperAdmin", "ClinicAdmin", "Doctor"), validate({ body: createLabOrderSchema }), createLabOrder);
router.put("/:id", requireRole("SuperAdmin", "ClinicAdmin", "LabTechnician", "Doctor"), validate({ body: updateLabOrderSchema }), updateLabOrder);
router.put("/:id/review", requireRole("SuperAdmin", "ClinicAdmin", "Doctor"), validate({ body: reviewLabOrderSchema }), reviewLabOrder);

export default router;
