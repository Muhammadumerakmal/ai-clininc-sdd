import { Request, Response, NextFunction } from "express";
import { AppointmentService } from "../services/appointment.service.js";
import { sendSuccess } from "../../../shared/response.js";

const appointmentService = new AppointmentService();

export async function createAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = { ...req.body, clinicId: req.body.clinicId || req.user?.clinicId };
    const appointment = await appointmentService.create(data);
    sendSuccess(res, appointment, "Appointment created successfully", 201);
  } catch (error) {
    next(error);
  }
}

export async function getAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const appointment = await appointmentService.findById(id);
    sendSuccess(res, appointment);
  } catch (error) {
    next(error);
  }
}

export async function updateAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const appointment = await appointmentService.update(id, req.body);
    sendSuccess(res, appointment, "Appointment updated successfully");
  } catch (error) {
    next(error);
  }
}

export async function cancelAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const appointment = await appointmentService.cancel(id);
    sendSuccess(res, appointment, "Appointment cancelled successfully");
  } catch (error) {
    next(error);
  }
}

export async function listAppointments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string | undefined;
    const doctorId = req.query.doctorId as string | undefined;
    const patientId = req.query.patientId as string | undefined;
    const clinicId = (req.query.clinicId as string) || req.user?.clinicId;
    const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined;
    const dateTo = req.query.dateTo ? new Date(req.query.dateTo as string) : undefined;

    const result = await appointmentService.list({ page, limit, status, doctorId, patientId, clinicId, dateFrom, dateTo });
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getQueue(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const clinicId = (req.params.clinicId as string) || req.user?.clinicId;
    const date = req.query.date ? new Date(req.query.date as string) : new Date();

    if (!clinicId) {
      res.status(400).json({ success: false, message: "Clinic ID required" });
      return;
    }

    const queue = await appointmentService.getQueue(clinicId, date);
    sendSuccess(res, { queue, date });
  } catch (error) {
    next(error);
  }
}

export async function getMyAppointments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const patientId = (req.params.patientId as string) || (req.query.patientId as string);
    if (!patientId) {
      res.status(400).json({ success: false, message: "Patient ID required" });
      return;
    }
    const appointments = await appointmentService.getPatientAppointments(patientId);
    sendSuccess(res, { appointments });
  } catch (error) {
    next(error);
  }
}
