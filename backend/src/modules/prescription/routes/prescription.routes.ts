import { Router } from "express";
import { createPrescription, getPrescription, getPatientPrescriptions, listPrescriptions, approvePrescription, updatePrescription } from "../controllers/prescription.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import { requireRole } from "../../../middleware/rbac.js";
import { validate } from "../../../middleware/validate.js";
import { createPrescriptionSchema, updatePrescriptionSchema, approvePrescriptionSchema } from "../validators/prescription.schema.js";

const router = Router();

router.use(authenticate);

router.get("/", requireRole("SuperAdmin", "ClinicAdmin", "Doctor", "Nurse"), listPrescriptions);
router.get("/patient/:patientId", requireRole("SuperAdmin", "ClinicAdmin", "Doctor", "Nurse", "Patient"), getPatientPrescriptions);
router.get("/:id", requireRole("SuperAdmin", "ClinicAdmin", "Doctor", "Nurse", "Patient"), getPrescription);
router.post("/", requireRole("SuperAdmin", "ClinicAdmin", "Doctor"), validate({ body: createPrescriptionSchema }), createPrescription);
router.put("/:id", requireRole("SuperAdmin", "ClinicAdmin", "Doctor"), validate({ body: updatePrescriptionSchema }), updatePrescription);
router.put("/:id/approve", requireRole("SuperAdmin", "ClinicAdmin", "Doctor"), validate({ body: approvePrescriptionSchema }), approvePrescription);

export default router;
