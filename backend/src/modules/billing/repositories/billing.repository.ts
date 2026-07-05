import { Invoice } from "../../../models/Invoice.js";
import { Payment } from "../../../models/Payment.js";

export class BillingRepository {
  async findInvoiceById(id: string) { return Invoice.findById(id); }
  async findInvoices(params: { skip?: number; take?: number; where?: Record<string, unknown> }) {
    let q = Invoice.find(params.where || {}).sort({ createdAt: -1 });
    if (params.skip) q = q.skip(params.skip);
    if (params.take) q = q.limit(params.take);
    return q;
  }
  async countInvoices(where?: Record<string, unknown>) { return Invoice.countDocuments(where || {}); }

  async createInvoice(data: Record<string, unknown>) {
    const count = await Invoice.countDocuments();
    const invoice = await Invoice.create({ ...data, invoiceNumber: `INV-${String(count + 1).padStart(6, "0")}` });
    return invoice;
  }

  async updateInvoice(id: string, data: Record<string, unknown>) { return Invoice.findByIdAndUpdate(id, data, { new: true }); }
  async createPayment(data: Record<string, unknown>) { return Payment.create(data); }
  async getPayments(invoiceId: string) { return Payment.find({ invoiceId }); }
}
