import { Router } from "express";
import { getDashboard, getRevenueReport, getAppointmentReport } from "../controllers/report.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import { requireRole } from "../../../middleware/rbac.js";
import { validate } from "../../../middleware/validate.js";
import { dateRangeSchema } from "../validators/report.schema.js";

const router = Router();
router.use(authenticate);

router.get("/dashboard", getDashboard);
router.get("/revenue", requireRole("SuperAdmin", "ClinicAdmin"), validate({ query: dateRangeSchema }), getRevenueReport);
router.get("/appointments", requireRole("SuperAdmin", "ClinicAdmin"), validate({ query: dateRangeSchema }), getAppointmentReport);

export default router;
