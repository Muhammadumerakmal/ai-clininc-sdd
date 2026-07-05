import { describe, it, expect, vi, beforeEach } from "vitest";

const mockRepo = vi.hoisted(() => ({ create: vi.fn(), findByUserId: vi.fn(), markAsRead: vi.fn(), markAllAsRead: vi.fn(), getUnreadCount: vi.fn() }));

vi.mock("../../../../src/modules/notification/repositories/notification.repository", () => ({
  NotificationRepository: vi.fn(() => mockRepo),
}));

vi.mock("../../../../src/config/logger", () => ({ logger: { info: vi.fn() } }));

import { NotificationService } from "../../../../src/modules/notification/services/notification.service";

describe("NotificationService", () => {
  let service: NotificationService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new NotificationService();
  });

  describe("send", () => {
    const data = { userId: "u1", type: "appointment_reminder", channel: "in-app", title: "Reminder", body: "You have an appointment tomorrow" };

    it("should create a notification", async () => {
      mockRepo.create.mockResolvedValue({ id: "n1", ...data, sentAt: new Date() });
      const result = await service.send(data);
      expect(result.id).toBe("n1");
    });

    it("should set sentAt date", async () => {
      mockRepo.create.mockResolvedValue({ id: "n1" });
      await service.send(data);
      expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({ sentAt: expect.any(Date) }));
    });
  });

  describe("list", () => {
    it("should return notifications for user", async () => {
      mockRepo.findByUserId.mockResolvedValue({ notifications: [{ id: "n1" }], pagination: { page: 1, limit: 20, total: 1, totalPages: 1 } });
      const result = await service.list("u1", 1, 20);
      expect(result.notifications).toHaveLength(1);
    });
  });

  describe("markAsRead", () => {
    it("should mark notification as read", async () => {
      mockRepo.markAsRead.mockResolvedValue({ id: "n1", isRead: true });
      const result = await service.markAsRead("n1");
      expect(result.isRead).toBe(true);
    });
  });

  describe("markAllAsRead", () => {
    it("should mark all notifications as read", async () => {
      await service.markAllAsRead("u1");
      expect(mockRepo.markAllAsRead).toHaveBeenCalledWith("u1");
    });
  });

  describe("getUnreadCount", () => {
    it("should return unread count", async () => {
      mockRepo.getUnreadCount.mockResolvedValue(5);
      const result = await service.getUnreadCount("u1");
      expect(result).toBe(5);
    });
  });
});
