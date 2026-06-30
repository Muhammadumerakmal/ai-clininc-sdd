import { Notification } from "../../../models/Notification.js";

export class NotificationRepository {
  async create(data: Record<string, unknown>) { return Notification.create(data); }
  async findByUserId(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      Notification.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments({ userId }),
    ]);
    return { notifications, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
  async markAsRead(id: string) { return Notification.findByIdAndUpdate(id, { isRead: true }, { new: true }); }
  async markAllAsRead(userId: string) { await Notification.updateMany({ userId, isRead: false }, { isRead: true }); }
  async getUnreadCount(userId: string) { return Notification.countDocuments({ userId, isRead: false }); }
}
