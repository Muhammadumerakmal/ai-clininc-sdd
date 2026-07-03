"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  gender: string;
  bloodGroup?: string;
  createdAt: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get<{ patients: Patient[]; pagination: { page: number; totalPages: number } }>(
      `/patients?page=${page}&limit=20&search=${search}`
    )
      .then((data) => {
        setPatients(data.patients || []);
        setTotalPages(data.pagination?.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search]);

  const columns = [
    { key: "firstName", header: "Name", cell: (p: Patient) => `${p.firstName} ${p.lastName}` },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "gender", header: "Gender" },
    { key: "bloodGroup", header: "Blood Group" },
    {
      key: "createdAt",
      header: "Registered",
      cell: (p: Patient) => new Date(p.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "",
      cell: (p: Patient) => (
        <Link href={`/patients/${p.id}`}>
          <Button variant="ghost" size="sm">View</Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Patients" description="Manage patient records">
        <Link href="/patients/new">
          <Button><Plus className="h-4 w-4 mr-2" />Add Patient</Button>
        </Link>
      </PageHeader>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search patients..." className="pl-10 max-w-sm" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>
      <DataTable columns={columns} data={patients} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} />
    </div>
  );
}
