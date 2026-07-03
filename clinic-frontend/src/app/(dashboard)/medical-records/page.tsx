"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  consultationNotes: string;
  diagnosis?: string;
  createdAt: string;
  patient?: { firstName: string; lastName: string };
  doctor?: { user?: { name: string } };
}

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ medicalRecords?: MedicalRecord[] }>("/medical-records")
      .then((d) => setRecords(d.medicalRecords || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "patient", header: "Patient", cell: (r: MedicalRecord) => r.patient ? `${r.patient.firstName} ${r.patient.lastName}` : r.patientId },
    { key: "doctor", header: "Doctor", cell: (r: MedicalRecord) => r.doctor?.user?.name || r.doctorId },
    { key: "diagnosis", header: "Diagnosis" },
    { key: "createdAt", header: "Date", cell: (r: MedicalRecord) => formatDate(r.createdAt) },
    {
      key: "actions", header: "",
      cell: (r: MedicalRecord) => (
        <Link href={`/medical-records/${r.id}`}>
          <Button variant="ghost" size="sm">View</Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Medical Records" description="Clinical documentation">
        <Link href="/medical-records/new">
          <Button><Plus className="h-4 w-4 mr-2" />New Record</Button>
        </Link>
      </PageHeader>
      <DataTable columns={columns} data={records} loading={loading} />
    </div>
  );
}
