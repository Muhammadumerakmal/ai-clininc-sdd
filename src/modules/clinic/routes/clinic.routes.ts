import { Router } from "express";
import { createClinic, getClinic, listClinics, updateClinic, createDepartment, getDepartments, updateDepartment } from "../controllers/clinic.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import { requireRole } from "../../../middleware/rbac.js";
import { validate } from "../../../middleware/validate.js";
import { createClinicSchema, updateClinicSchema, createDepartmentSchema } from "../validators/clinic.schema.js";

const router = Router();
router.use(authenticate);

router.get("/", listClinics);
router.get("/:id", getClinic);
router.post("/", requireRole("SuperAdmin"), validate({ body: createClinicSchema }), createClinic);
router.put("/:id", requireRole("SuperAdmin", "ClinicAdmin"), validate({ body: updateClinicSchema }), updateClinic);
router.get("/:clinicId/departments", getDepartments);
router.post("/:clinicId/departments", requireRole("SuperAdmin", "ClinicAdmin"), validate({ body: createDepartmentSchema }), createDepartment);
router.put("/departments/:id", requireRole("SuperAdmin", "ClinicAdmin"), updateDepartment);

export default router;
