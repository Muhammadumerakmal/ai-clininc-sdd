"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

interface Doctor {
  id: string;
  user?: { name: string; email: string };
  specialization: string;
  isAvailable: boolean;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get<{ doctors: Doctor[]; pagination: { page: number; totalPages: number } }>(
      `/doctors?page=${page}&limit=20&search=${search}`
    )
      .then((data) => {
        setDoctors(data.doctors || []);
        setTotalPages(data.pagination?.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search]);

  const columns = [
    { key: "name", header: "Name", cell: (d: Doctor) => d.user?.name || "-" },
    { key: "email", header: "Email", cell: (d: Doctor) => d.user?.email || "-" },
    { key: "specialization", header: "Specialization" },
    { key: "isAvailable", header: "Status", cell: (d: Doctor) => d.isAvailable ? <StatusBadge status="Active" /> : <StatusBadge status="Inactive" /> },
    {
      key: "actions", header: "",
      cell: (d: Doctor) => (
        <Link href={`/doctors/${d.id}`}>
          <Button variant="ghost" size="sm">View</Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Doctors" description="Manage doctor profiles" />
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search doctors..." className="pl-10 max-w-sm" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>
      <DataTable columns={columns} data={doctors} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} />
    </div>
  );
}
