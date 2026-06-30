import { Router } from "express";
import { createMedicine, updateMedicine, listMedicines, getLowStock, dispense } from "../controllers/pharmacy.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import { requireRole } from "../../../middleware/rbac.js";
import { validate } from "../../../middleware/validate.js";
import { createMedicineSchema, updateMedicineSchema, dispenseSchema } from "../validators/pharmacy.schema.js";

const router = Router();

router.use(authenticate);

router.get("/low-stock", requireRole("SuperAdmin", "ClinicAdmin", "Pharmacist"), getLowStock);
router.get("/", requireRole("SuperAdmin", "ClinicAdmin", "Doctor", "Pharmacist", "Nurse"), listMedicines);
router.post("/", requireRole("SuperAdmin", "ClinicAdmin"), validate({ body: createMedicineSchema }), createMedicine);
router.put("/:id", requireRole("SuperAdmin", "ClinicAdmin"), validate({ body: updateMedicineSchema }), updateMedicine);
router.post("/dispense", requireRole("SuperAdmin", "ClinicAdmin", "Pharmacist"), validate({ body: dispenseSchema }), dispense);

export default router;
