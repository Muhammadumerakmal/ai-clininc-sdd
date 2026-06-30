import { BillingRepository } from "../repositories/billing.repository.js";
import { NotFoundError, ValidationError } from "../../../shared/errors.js";
import { logger } from "../../../config/logger.js";

const repo = new BillingRepository();

export class BillingService {
  async createInvoice(data: { patientId: string; appointmentId?: string; subtotal: number; taxPercentage: number; discountPercentage: number }) {
    const taxAmount = data.subtotal * (data.taxPercentage / 100);
    const discountAmount = data.subtotal * (data.discountPercentage / 100);
    const total = data.subtotal + taxAmount - discountAmount;

    const invoice = await repo.createInvoice({
      patientId: data.patientId,
      appointmentId: data.appointmentId,
      subtotal: data.subtotal,
      taxPercentage: data.taxPercentage,
      taxAmount,
      discountPercentage: data.discountPercentage,
      discountAmount,
      total,
    });

    logger.info({ event: "invoice_created", invoiceId: invoice.id, total });
    return invoice;
  }

  async findById(id: string) {
    const invoice = await repo.findInvoiceById(id);
    if (!invoice) throw new NotFoundError("Invoice not found");
    return invoice;
  }

  async list(params: { page: number; limit: number; patientId?: string; status?: string }) {
    const where: Record<string, unknown> = {};
    if (params.patientId) where.patientId = params.patientId;
    if (params.status) where.status = params.status;

    const [invoices, total] = await Promise.all([
      repo.findInvoices({ skip: (params.page - 1) * params.limit, take: params.limit, where }),
      repo.countInvoices(where),
    ]);
    return { invoices, pagination: { page: params.page, limit: params.limit, total, totalPages: Math.ceil(total / params.limit) } };
  }

  async updateStatus(id: string, status: string) {
    const invoice = await repo.updateInvoice(id, { status, paidAt: status === "Paid" ? new Date() : undefined });
    if (!invoice) throw new NotFoundError("Invoice not found");
    logger.info({ event: "invoice_updated", invoiceId: id, status });
    return invoice;
  }

  async makePayment(data: { invoiceId: string; amount: number; method: string; reference?: string; notes?: string }) {
    const invoice = await repo.findInvoiceById(data.invoiceId);
    if (!invoice) throw new NotFoundError("Invoice not found");

    const totalPaid = data.amount;
    if (totalPaid < invoice.total) {
      throw new ValidationError(`Partial payment not allowed. Total: ${invoice.total}`);
    }

    const payment = await repo.createPayment(data);
    await repo.updateInvoice(data.invoiceId, { status: "Paid", paidAt: new Date() });

    logger.info({ event: "payment_made", invoiceId: data.invoiceId, amount: data.amount });
    return payment;
  }

  async getPayments(invoiceId: string) { return repo.getPayments(invoiceId); }
}
