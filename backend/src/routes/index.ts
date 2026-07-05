import { Router } from "express";
import healthRoutes from "../modules/health/health.routes.js";
import authRoutes from "../modules/auth/routes/auth.routes.js";
import patientRoutes from "../modules/patient/routes/patient.routes.js";
import appointmentRoutes from "../modules/appointment/routes/appointment.routes.js";
import medicalRecordRoutes from "../modules/medical-record/routes/medical-record.routes.js";
import prescriptionRoutes from "../modules/prescription/routes/prescription.routes.js";
import labRoutes from "../modules/lab/routes/lab.routes.js";
import pharmacyRoutes from "../modules/pharmacy/routes/pharmacy.routes.js";
import doctorRoutes from "../modules/doctor/routes/doctor.routes.js";
import clinicRoutes from "../modules/clinic/routes/clinic.routes.js";
import billingRoutes from "../modules/billing/routes/billing.routes.js";
import notificationRoutes from "../modules/notification/routes/notification.routes.js";
import reportRoutes from "../modules/reports/routes/report.routes.js";
import aiRoutes from "../modules/ai/routes/ai.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/patients", patientRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/medical-records", medicalRecordRoutes);
router.use("/prescriptions", prescriptionRoutes);
router.use("/lab-orders", labRoutes);
router.use("/pharmacy", pharmacyRoutes);
router.use("/doctors", doctorRoutes);
router.use("/clinics", clinicRoutes);
router.use("/billing", billingRoutes);
router.use("/notifications", notificationRoutes);
router.use("/reports", reportRoutes);
router.use("/ai", aiRoutes);

export default router;
