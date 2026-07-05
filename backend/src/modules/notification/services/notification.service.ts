import { NotificationRepository } from "../repositories/notification.repository.js";
import { logger } from "../../../config/logger.js";

const repo = new NotificationRepository();

export class NotificationService {
  async send(data: { userId: string; type: string; channel: string; title: string; body: string }) {
    const notification = await repo.create({ ...data, sentAt: new Date() });

    if (data.channel === "email") {
      logger.info({ event: "email_notification", userId: data.userId, title: data.title });
    } else if (data.channel === "sms") {
      logger.info({ event: "sms_notification", userId: data.userId });
    }

    return notification;
  }

  async list(userId: string, page: number, limit: number) {
    return repo.findByUserId(userId, page, limit);
  }

  async markAsRead(id: string) {
    return repo.markAsRead(id);
  }

  async markAllAsRead(userId: string) {
    await repo.markAllAsRead(userId);
  }

  async getUnreadCount(userId: string) {
    return repo.getUnreadCount(userId);
  }
}
