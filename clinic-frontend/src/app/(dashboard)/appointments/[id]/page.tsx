"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Appointment {
  id: string;
  patientId: { firstName: string; lastName: string; _id: string };
  doctorId: { user?: { name: string }; specialization?: string; _id: string };
  clinicId: string;
  dateTime: string;
  endTime: string;
  status: string;
  reason?: string;
  notes?: string;
  queueNumber?: number;
}

export default function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [appt, setAppt] = useState<Appointment | null>(null);

  useEffect(() => {
    api.get<Appointment>(`/appointments/${id}`).then(setAppt).catch(() => router.push("/appointments"));
  }, [id, router]);

  if (!appt) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  return (
    <div>
      <PageHeader title="Appointment Details" description={`${formatDate(appt.dateTime)}`}>
        <Button variant="outline" onClick={() => router.push("/appointments")}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
        <Link href={`/appointments/${id}/edit`}><Button variant="outline"><Edit className="h-4 w-4 mr-2" />Edit</Button></Link>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Appointment Info</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><StatusBadge status={appt.status} /></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date & Time</span><span>{formatDate(appt.dateTime)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">End Time</span><span>{formatDate(appt.endTime)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Queue Number</span><span>{appt.queueNumber ?? "-"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Reason</span><span>{appt.reason || "-"}</span></div>
            <div><span className="text-muted-foreground block mb-1">Notes</span><p className="text-sm">{appt.notes || "-"}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Patient</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span>{appt.patientId ? `${appt.patientId.firstName} ${appt.patientId.lastName}` : appt.patientId}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Doctor</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span>{appt.doctorId?.user?.name || "-"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Specialization</span><span>{appt.doctorId?.specialization || "-"}</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
