import { Router } from "express";
import { createAppointment, getAppointment, updateAppointment, cancelAppointment, listAppointments, getQueue, getMyAppointments } from "../controllers/appointment.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import { requireRole } from "../../../middleware/rbac.js";
import { validate } from "../../../middleware/validate.js";
import { createAppointmentSchema, updateAppointmentSchema } from "../validators/appointment.schema.js";

const router = Router();

router.use(authenticate);

router.get("/queue", requireRole("SuperAdmin", "ClinicAdmin", "Receptionist", "Doctor"), getQueue);
router.get("/my", requireRole("Patient"), getMyAppointments);
router.get("/", requireRole("SuperAdmin", "ClinicAdmin", "Doctor", "Nurse", "Receptionist"), listAppointments);
router.get("/:id", requireRole("SuperAdmin", "ClinicAdmin", "Doctor", "Nurse", "Receptionist", "Patient"), getAppointment);
router.post("/", requireRole("SuperAdmin", "ClinicAdmin", "Receptionist", "Doctor"), validate({ body: createAppointmentSchema }), createAppointment);
router.put("/:id", requireRole("SuperAdmin", "ClinicAdmin", "Receptionist", "Doctor"), validate({ body: updateAppointmentSchema }), updateAppointment);
router.delete("/:id", requireRole("SuperAdmin", "ClinicAdmin", "Receptionist"), cancelAppointment);

export default router;
