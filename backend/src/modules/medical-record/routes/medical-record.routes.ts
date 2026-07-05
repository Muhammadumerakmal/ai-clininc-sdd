import { Router } from "express";
import { createRecord, getRecord, getPatientRecords, listRecords, updateRecord } from "../controllers/medical-record.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import { requireRole } from "../../../middleware/rbac.js";
import { validate } from "../../../middleware/validate.js";
import { createMedicalRecordSchema, updateMedicalRecordSchema } from "../validators/medical-record.schema.js";

const router = Router();

router.use(authenticate);

router.get("/", requireRole("SuperAdmin", "ClinicAdmin", "Doctor", "Nurse"), listRecords);
router.get("/patient/:patientId", requireRole("SuperAdmin", "ClinicAdmin", "Doctor", "Nurse", "Patient"), getPatientRecords);
router.get("/:id", requireRole("SuperAdmin", "ClinicAdmin", "Doctor", "Nurse", "Patient"), getRecord);
router.post("/", requireRole("SuperAdmin", "ClinicAdmin", "Doctor"), validate({ body: createMedicalRecordSchema }), createRecord);
router.put("/:id", requireRole("SuperAdmin", "ClinicAdmin", "Doctor"), validate({ body: updateMedicalRecordSchema }), updateRecord);

export default router;
