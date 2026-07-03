"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";

interface LabOrder {
  id: string;
  testName: string;
  patientId: string;
  doctorId: string;
  status: string;
  createdAt: string;
  patient?: { firstName: string; lastName: string };
  doctor?: { user?: { name: string } };
}

export default function LabOrdersPage() {
  const [orders, setOrders] = useState<LabOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ labOrders?: LabOrder[] }>("/lab-orders")
      .then((d) => setOrders(d.labOrders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "testName", header: "Test Name" },
    { key: "patient", header: "Patient", cell: (o: LabOrder) => o.patient ? `${o.patient.firstName} ${o.patient.lastName}` : o.patientId },
    { key: "doctor", header: "Ordered By", cell: (o: LabOrder) => o.doctor?.user?.name || o.doctorId },
    { key: "createdAt", header: "Date", cell: (o: LabOrder) => formatDate(o.createdAt) },
    { key: "status", header: "Status", cell: (o: LabOrder) => <StatusBadge status={o.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Lab Orders" description="Manage lab test orders" />
      <DataTable columns={columns} data={orders} loading={loading} />
    </div>
  );
}
