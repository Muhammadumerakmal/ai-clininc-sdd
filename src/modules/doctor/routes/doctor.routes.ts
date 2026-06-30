import { Router } from "express";
import { createDoctor, getDoctor, listDoctors, updateDoctor, requestLeave, getLeaves, updateLeave } from "../controllers/doctor.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import { requireRole } from "../../../middleware/rbac.js";
import { validate } from "../../../middleware/validate.js";
import { createDoctorSchema, updateDoctorSchema, createLeaveSchema, updateLeaveSchema } from "../validators/doctor.schema.js";

const router = Router();
router.use(authenticate);

router.get("/", listDoctors);
router.get("/:id", getDoctor);
router.post("/", requireRole("SuperAdmin", "ClinicAdmin"), validate({ body: createDoctorSchema }), createDoctor);
router.put("/:id", requireRole("SuperAdmin", "ClinicAdmin"), validate({ body: updateDoctorSchema }), updateDoctor);
router.post("/:doctorId/leave", validate({ body: createLeaveSchema }), requestLeave);
router.get("/:doctorId/leave", getLeaves);
router.put("/leave/:id", requireRole("SuperAdmin", "ClinicAdmin"), validate({ body: updateLeaveSchema }), updateLeave);

export default router;
