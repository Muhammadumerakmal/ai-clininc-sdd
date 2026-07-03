"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  total: number;
  status: string;
  createdAt: string;
  patient?: { firstName: string; lastName: string };
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ invoices?: Invoice[] }>("/billing")
      .then((d) => setInvoices(d.invoices || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "invoiceNumber", header: "Invoice #" },
    { key: "patient", header: "Patient", cell: (i: Invoice) => i.patient ? `${i.patient.firstName} ${i.patient.lastName}` : i.patientId },
    { key: "total", header: "Amount", cell: (i: Invoice) => formatCurrency(i.total) },
    { key: "createdAt", header: "Date", cell: (i: Invoice) => formatDate(i.createdAt) },
    { key: "status", header: "Status", cell: (i: Invoice) => <StatusBadge status={i.status} /> },
    {
      key: "actions", header: "",
      cell: (i: Invoice) => (
        <Link href={`/billing/${i.id}`}>
          <Button variant="ghost" size="sm">View</Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Billing" description="Manage invoices and payments">
        <Link href="/billing/new">
          <Button><Plus className="h-4 w-4 mr-2" />New Invoice</Button>
        </Link>
      </PageHeader>
      <DataTable columns={columns} data={invoices} loading={loading} />
    </div>
  );
}
