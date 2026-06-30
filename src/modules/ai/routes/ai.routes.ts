import { Router } from "express";
import { chat, analyzeSymptoms, suggestDiagnosis, draftPrescription } from "../controllers/ai.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import { requireRole } from "../../../middleware/rbac.js";
import { validate } from "../../../middleware/validate.js";
import { chatSchema, symptomAnalysisSchema, diagnosisSuggestionSchema, prescriptionDraftSchema } from "../validators/ai.schema.js";

const router = Router();
router.use(authenticate);

router.post("/chat", validate({ body: chatSchema }), chat);
router.post("/symptom-analysis", requireRole("Doctor"), validate({ body: symptomAnalysisSchema }), analyzeSymptoms);
router.post("/diagnosis-suggestion", requireRole("SuperAdmin", "ClinicAdmin", "Doctor"), validate({ body: diagnosisSuggestionSchema }), suggestDiagnosis);
router.post("/prescription-draft", requireRole("SuperAdmin", "ClinicAdmin", "Doctor"), validate({ body: prescriptionDraftSchema }), draftPrescription);

export default router;
