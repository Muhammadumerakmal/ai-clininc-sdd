"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Phone, Mail, MapPin, ArrowLeft } from "lucide-react";

interface Department {
  id: string;
  name: string;
  description?: string;
}

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  settings?: Record<string, unknown>;
  workingHours?: Record<string, unknown>;
  departments?: Department[];
}

export default function ClinicDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    api.get<Clinic>(`/clinics/${id}`).then(setClinic).catch(() => router.push("/clinics"));
    api.get<Department[]>(`/clinics/${id}/departments`).then(setDepartments).catch(() => {});
  }, [id, router]);

  if (!clinic) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  return (
    <div>
      <PageHeader title={clinic.name} description="Clinic details">
        <Button variant="outline" onClick={() => router.push("/clinics")}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Contact Information</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> {clinic.address}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {clinic.phone}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> {clinic.email}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Departments ({departments.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {departments.length > 0 ? departments.map((d) => (
              <div key={d.id} className="p-2 bg-muted rounded">
                <p className="font-medium">{d.name}</p>
                {d.description && <p className="text-xs text-muted-foreground">{d.description}</p>}
              </div>
            )) : <p className="text-muted-foreground">No departments</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
