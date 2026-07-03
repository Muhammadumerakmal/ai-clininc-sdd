import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError, ValidationError } from "../../../../src/shared/errors";

const mockRepo = vi.hoisted(() => ({ createInvoice: vi.fn(), findInvoiceById: vi.fn(), findInvoices: vi.fn(), countInvoices: vi.fn(), updateInvoice: vi.fn(), createPayment: vi.fn(), getPayments: vi.fn() }));

vi.mock("../../../../src/modules/billing/repositories/billing.repository", () => ({
  BillingRepository: vi.fn(() => mockRepo),
}));

vi.mock("../../../../src/config/logger", () => ({ logger: { info: vi.fn() } }));

import { BillingService } from "../../../../src/modules/billing/services/billing.service";

describe("BillingService", () => {
  let service: BillingService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new BillingService();
  });

  describe("createInvoice", () => {
    const data = { patientId: "p1", subtotal: 200, taxPercentage: 10, discountPercentage: 5 };

    it("should create an invoice with calculated totals", async () => {
      mockRepo.createInvoice.mockResolvedValue({ id: "inv1", ...data, total: 210 });
      const result = await service.createInvoice(data);
      expect(result.id).toBe("inv1");
      expect(mockRepo.createInvoice).toHaveBeenCalledWith(expect.objectContaining({
        subtotal: 200, taxAmount: 20, discountAmount: 10, total: 210,
      }));
    });
  });

  describe("findById", () => {
    it("should return invoice if found", async () => {
      mockRepo.findInvoiceById.mockResolvedValue({ id: "inv1" });
      const result = await service.findById("inv1");
      expect(result.id).toBe("inv1");
    });

    it("should throw NotFoundError if not found", async () => {
      mockRepo.findInvoiceById.mockResolvedValue(null);
      await expect(service.findById("inv1")).rejects.toThrow(NotFoundError);
    });
  });

  describe("list", () => {
    it("should return paginated invoices", async () => {
      mockRepo.findInvoices.mockResolvedValue([{ id: "inv1" }]);
      mockRepo.countInvoices.mockResolvedValue(1);
      const result = await service.list({ page: 1, limit: 10 });
      expect(result.invoices).toHaveLength(1);
    });
  });

  describe("updateStatus", () => {
    it("should update invoice status and set paidAt", async () => {
      mockRepo.updateInvoice.mockResolvedValue({ id: "inv1", status: "Paid" });
      const result = await service.updateStatus("inv1", "Paid");
      expect(result.status).toBe("Paid");
      expect(mockRepo.updateInvoice).toHaveBeenCalledWith("inv1", { status: "Paid", paidAt: expect.any(Date) });
    });

    it("should throw NotFoundError if invoice not found", async () => {
      mockRepo.updateInvoice.mockResolvedValue(null);
      await expect(service.updateStatus("inv1", "Paid")).rejects.toThrow(NotFoundError);
    });
  });

  describe("makePayment", () => {
    const data = { invoiceId: "inv1", amount: 210, method: "Cash" };

    it("should process payment if amount matches total", async () => {
      mockRepo.findInvoiceById.mockResolvedValue({ id: "inv1", total: 210 });
      mockRepo.createPayment.mockResolvedValue({ id: "pay1" });
      mockRepo.updateInvoice.mockResolvedValue({ id: "inv1", status: "Paid" });
      const result = await service.makePayment(data);
      expect(result.id).toBe("pay1");
      expect(mockRepo.updateInvoice).toHaveBeenCalledWith("inv1", { status: "Paid", paidAt: expect.any(Date) });
    });

    it("should throw NotFoundError if invoice not found", async () => {
      mockRepo.findInvoiceById.mockResolvedValue(null);
      await expect(service.makePayment(data)).rejects.toThrow(NotFoundError);
    });

    it("should throw ValidationError if amount is less than total", async () => {
      mockRepo.findInvoiceById.mockResolvedValue({ id: "inv1", total: 500 });
      await expect(service.makePayment({ ...data, amount: 100 })).rejects.toThrow(ValidationError);
    });
  });

  describe("getPayments", () => {
    it("should return payments for invoice", async () => {
      mockRepo.getPayments.mockResolvedValue([{ id: "pay1" }]);
      const result = await service.getPayments("inv1");
      expect(result).toHaveLength(1);
    });
  });
});
