import { z } from "zod";

export const sendNotificationSchema = z.object({
  userId: z.string(),
  type: z.string(),
  channel: z.enum(["email", "sms", "in-app"]),
  title: z.string().min(1),
  body: z.string().min(1),
});

export const createReminderSchema = z.object({
  appointmentId: z.string(),
  type: z.enum(["email", "sms"]),
  remindAt: z.coerce.date(),
});
