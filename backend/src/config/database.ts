import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "./logger.js";
import { User } from "../models/User.js";
import { Clinic } from "../models/Clinic.js";
import { Department } from "../models/Department.js";
import { Doctor } from "../models/Doctor.js";
import { DoctorDepartment } from "../models/DoctorDepartment.js";
import { LeaveRecord } from "../models/LeaveRecord.js";
import { Patient } from "../models/Patient.js";
import { Appointment } from "../models/Appointment.js";
import { MedicalRecord } from "../models/MedicalRecord.js";
import { Prescription } from "../models/Prescription.js";
import { LabOrder } from "../models/LabOrder.js";
import { Medicine } from "../models/Medicine.js";
import { Dispensation } from "../models/Dispensation.js";
import { Invoice } from "../models/Invoice.js";
import { Payment } from "../models/Payment.js";
import { Notification } from "../models/Notification.js";
import { AuditLog } from "../models/AuditLog.js";
import { AIInteraction } from "../models/AIInteraction.js";
import { VerificationToken } from "../models/VerificationToken.js";

export {
  User,
  Clinic,
  Department,
  Doctor,
  DoctorDepartment,
  LeaveRecord,
  Patient,
  Appointment,
  MedicalRecord,
  Prescription,
  LabOrder,
  Medicine,
  Dispensation,
  Invoice,
  Payment,
  Notification,
  AuditLog,
  AIInteraction,
  VerificationToken,
};

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URL);
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error({ event: "database_connection_failed", error });
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info("Database disconnected");
}

export { mongoose };
