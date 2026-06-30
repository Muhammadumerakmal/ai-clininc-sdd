import { Router } from "express";
import healthRoutes from "../modules/health/health.routes.js";
import authRoutes from "../modules/auth/routes/auth.routes.js";
import patientRoutes from "../modules/patient/routes/patient.routes.js";
import appointmentRoutes from "../modules/appointment/routes/appointment.routes.js";
import medicalRecordRoutes from "../modules/medical-record/routes/medical-record.routes.js";
import prescriptionRoutes from "../modules/prescription/routes/prescription.routes.js";
import labRoutes from "../modules/lab/routes/lab.routes.js";
import pharmacyRoutes from "../modules/pharmacy/routes/pharmacy.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/patients", patientRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/medical-records", medicalRecordRoutes);
router.use("/prescriptions", prescriptionRoutes);
router.use("/lab-orders", labRoutes);
router.use("/pharmacy", pharmacyRoutes);

export default router;
