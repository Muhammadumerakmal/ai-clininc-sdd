"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  dateTime: string;
  status: string;
  reason?: string;
  patient?: { firstName: string; lastName: string };
  doctor?: { user?: { name: string } };
}

export default function AppointmentsPage() {
  const [data, setData] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    api.get<{ appointments?: Appointment[]; pagination?: { page: number; totalPages: number } }>(
      `/appointments?page=${page}&limit=20&search=${search}`
    )
      .then((res) => {
        setData(res.appointments || []);
        setTotalPages(res.pagination?.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search]);

  const columns = [
    { key: "dateTime", header: "Date & Time", cell: (a: Appointment) => formatDate(a.dateTime) },
    { key: "patient", header: "Patient", cell: (a: Appointment) => a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : a.patientId },
    { key: "doctor", header: "Doctor", cell: (a: Appointment) => a.doctor?.user?.name || a.doctorId },
    { key: "reason", header: "Reason" },
    { key: "status", header: "Status", cell: (a: Appointment) => <StatusBadge status={a.status} /> },
    {
      key: "actions", header: "",
      cell: (a: Appointment) => (
        <Link href={`/appointments/${a.id}`}>
          <Button variant="ghost" size="sm">View</Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Appointments" description="Manage appointments">
        <Link href="/appointments/new">
          <Button><Plus className="h-4 w-4 mr-2" />New Appointment</Button>
        </Link>
      </PageHeader>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search appointments..." className="pl-10 max-w-sm" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>
      <DataTable columns={columns} data={data} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} />
    </div>
  );
}
