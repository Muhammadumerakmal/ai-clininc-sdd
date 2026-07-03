"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: { firstName: string; lastName: string };
  appointmentId?: string;
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  discountPercentage: number;
  discountAmount: number;
  total: number;
  status: string;
  paidAt?: string;
  createdAt: string;
}

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    api.get<Invoice>(`/billing/${id}`).then(setInvoice).catch(() => router.push("/billing"));
  }, [id, router]);

  if (!invoice) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  return (
    <div>
      <PageHeader title={`Invoice #${invoice.invoiceNumber}`} description={`Created ${formatDate(invoice.createdAt)}`}>
        <Button variant="outline" onClick={() => router.push("/billing")}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Invoice Details</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Invoice #</span><span>{invoice.invoiceNumber}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><StatusBadge status={invoice.status} /></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Patient</span><span>{invoice.patientId ? `${invoice.patientId.firstName} ${invoice.patientId.lastName}` : "-"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{formatDate(invoice.createdAt)}</span></div>
            {invoice.paidAt && <div className="flex justify-between"><span className="text-muted-foreground">Paid At</span><span>{formatDate(invoice.paidAt)}</span></div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Amount Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(invoice.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax ({invoice.taxPercentage}%)</span><span>{formatCurrency(invoice.taxAmount)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Discount ({invoice.discountPercentage}%)</span><span className="text-green-600">-{formatCurrency(invoice.discountAmount)}</span></div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span><span>{formatCurrency(invoice.total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
