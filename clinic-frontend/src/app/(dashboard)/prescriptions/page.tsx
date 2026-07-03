"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  isAIGenerated: boolean;
  requiresDoctorApproval: boolean;
  approvedAt?: string;
  createdAt: string;
  patient?: { firstName: string; lastName: string };
  doctor?: { user?: { name: string } };
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ prescriptions?: Prescription[] }>("/prescriptions")
      .then((d) => setPrescriptions(d.prescriptions || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "patient", header: "Patient", cell: (p: Prescription) => p.patient ? `${p.patient.firstName} ${p.patient.lastName}` : p.patientId },
    { key: "doctor", header: "Doctor", cell: (p: Prescription) => p.doctor?.user?.name || p.doctorId },
    { key: "createdAt", header: "Date", cell: (p: Prescription) => formatDate(p.createdAt) },
    { key: "isAIGenerated", header: "AI", cell: (p: Prescription) => p.isAIGenerated ? <Badge variant="secondary">AI</Badge> : "-" },
    { key: "approvedAt", header: "Status", cell: (p: Prescription) => p.approvedAt ? <StatusBadge status="Approved" /> : <StatusBadge status="Pending" /> },
    {
      key: "actions", header: "",
      cell: (p: Prescription) => (
        <Link href={`/prescriptions/${p.id}`}>
          <Button variant="ghost" size="sm">View</Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Prescriptions" description="Manage prescriptions">
        <Link href="/prescriptions/new">
          <Button><Plus className="h-4 w-4 mr-2" />New Prescription</Button>
        </Link>
      </PageHeader>
      <DataTable columns={columns} data={prescriptions} loading={loading} />
    </div>
  );
}
