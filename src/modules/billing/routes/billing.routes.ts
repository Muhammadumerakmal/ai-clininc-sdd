import { Router } from "express";
import { createInvoice, getInvoice, listInvoices, updateInvoice, makePayment, getPayments } from "../controllers/billing.controller.js";
import { authenticate } from "../../../middleware/auth.js";
import { requireRole } from "../../../middleware/rbac.js";
import { validate } from "../../../middleware/validate.js";
import { createInvoiceSchema, updateInvoiceSchema, createPaymentSchema } from "../validators/billing.schema.js";

const router = Router();
router.use(authenticate);

router.get("/", requireRole("SuperAdmin", "ClinicAdmin", "Receptionist"), listInvoices);
router.get("/:id", getInvoice);
router.post("/", requireRole("SuperAdmin", "ClinicAdmin", "Receptionist"), validate({ body: createInvoiceSchema }), createInvoice);
router.put("/:id", requireRole("SuperAdmin", "ClinicAdmin"), validate({ body: updateInvoiceSchema }), updateInvoice);
router.post("/payments", requireRole("SuperAdmin", "ClinicAdmin", "Receptionist"), validate({ body: createPaymentSchema }), makePayment);
router.get("/:invoiceId/payments", getPayments);

export default router;
