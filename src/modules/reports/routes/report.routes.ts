import { Router } from "express";
import { getDashboard, getRevenueReport, getAppointmentReport } from "../controllers/report.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import { requireRole } from "../../../middleware/rbac.js";

const router = Router();
router.use(authenticate);

router.get("/dashboard", getDashboard);
router.get("/revenue", requireRole("SuperAdmin", "ClinicAdmin"), getRevenueReport);
router.get("/appointments", requireRole("SuperAdmin", "ClinicAdmin"), getAppointmentReport);

export default router;
