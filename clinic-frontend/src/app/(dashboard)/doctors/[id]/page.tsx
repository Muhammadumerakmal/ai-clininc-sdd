"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

interface Doctor {
  id: string;
  userId: { name: string; email: string };
  specialization: string;
  qualifications?: { degree: string; institution: string; year: number }[];
  schedule?: Record<string, { start: string; end: string }[]>;
  isAvailable: boolean;
}

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    api.get<Doctor>(`/doctors/${id}`).then(setDoctor).catch(() => router.push("/doctors"));
  }, [id, router]);

  if (!doctor) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  return (
    <div>
      <PageHeader title={doctor.userId?.name || "Doctor"} description={doctor.specialization}>
        <Button variant="outline" onClick={() => router.push("/doctors")}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span>{doctor.userId?.name || "-"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{doctor.userId?.email || "-"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Specialization</span><span>{doctor.specialization}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span>{doctor.isAvailable ? <StatusBadge status="Active" /> : <StatusBadge status="Inactive" />}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Qualifications</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {doctor.qualifications?.length ? doctor.qualifications.map((q, i) => (
              <div key={i} className="p-2 bg-muted rounded">
                <p className="font-medium">{q.degree}</p>
                <p className="text-muted-foreground">{q.institution} ({q.year})</p>
              </div>
            )) : <span className="text-muted-foreground">No qualifications listed</span>}
          </CardContent>
        </Card>
        {doctor.schedule && Object.keys(doctor.schedule).length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader><CardTitle className="text-lg">Schedule</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(doctor.schedule).map(([day, slots]) => (
                  <div key={day} className="p-2 bg-muted rounded capitalize">
                    <p className="font-medium mb-1">{day}</p>
                    {(slots as { start: string; end: string }[]).map((s, i) => (
                      <p key={i} className="text-muted-foreground text-xs">{s.start} - {s.end}</p>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
