import { Router } from "express";
import { createPatient, getPatient, updatePatient, listPatients, searchPatients } from "../controllers/patient.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import { requireRole } from "../../../middleware/rbac.js";
import { validate } from "../../../middleware/validate.js";
import { createPatientSchema, updatePatientSchema } from "../validators/patient.schema.js";

const router = Router();

router.use(authenticate);

router.get("/search", searchPatients);
router.get("/", requireRole("SuperAdmin", "ClinicAdmin", "Doctor", "Nurse", "Receptionist"), listPatients);
router.get("/:id", requireRole("SuperAdmin", "ClinicAdmin", "Doctor", "Nurse", "Receptionist"), getPatient);
router.post("/", requireRole("SuperAdmin", "ClinicAdmin", "Receptionist"), validate({ body: createPatientSchema }), createPatient);
router.put("/:id", requireRole("SuperAdmin", "ClinicAdmin", "Receptionist"), validate({ body: updatePatientSchema }), updatePatient);

export default router;
