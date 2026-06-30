import { Router } from "express";
import { sendNotification, listNotifications, markAsRead, markAllAsRead, getUnreadCount } from "../controllers/notification.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import { requireRole } from "../../../middleware/rbac.js";
import { validate } from "../../../middleware/validate.js";
import { sendNotificationSchema } from "../validators/notification.schema.js";

const router = Router();
router.use(authenticate);

router.get("/unread-count", getUnreadCount);
router.get("/", listNotifications);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", markAsRead);
router.post("/", requireRole("SuperAdmin", "ClinicAdmin"), validate({ body: sendNotificationSchema }), sendNotification);

export default router;
