"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface MedicalRecord {
  id: string;
  patientId: { firstName: string; lastName: string };
  doctorId: { user?: { name: string } };
  appointmentId?: string;
  consultationNotes: string;
  diagnosis?: string;
  treatmentPlan?: string;
  vitals?: { bloodPressure?: string; heartRate?: number; temperature?: number; respiratoryRate?: number; oxygenSaturation?: number; weight?: number; height?: number };
  aiSummary?: string;
  createdAt: string;
}

export default function MedicalRecordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [record, setRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    api.get<MedicalRecord>(`/medical-records/${id}`).then(setRecord).catch(() => router.push("/medical-records"));
  }, [id, router]);

  if (!record) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  return (
    <div>
      <PageHeader title="Medical Record" description={`Created ${formatDate(record.createdAt)}`}>
        <Button variant="outline" onClick={() => router.push("/medical-records")}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Patient & Doctor</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Patient</span><span>{record.patientId ? `${record.patientId.firstName} ${record.patientId.lastName}` : "-"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Doctor</span><span>{record.doctorId?.user?.name || "-"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{formatDate(record.createdAt)}</span></div>
          </CardContent>
        </Card>
        {record.vitals && (
          <Card>
            <CardHeader><CardTitle className="text-lg">Vitals</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {record.vitals.bloodPressure && <div className="flex justify-between"><span className="text-muted-foreground">Blood Pressure</span><span>{record.vitals.bloodPressure}</span></div>}
              {record.vitals.heartRate && <div className="flex justify-between"><span className="text-muted-foreground">Heart Rate</span><span>{record.vitals.heartRate} bpm</span></div>}
              {record.vitals.temperature && <div className="flex justify-between"><span className="text-muted-foreground">Temperature</span><span>{record.vitals.temperature}°F</span></div>}
              {record.vitals.respiratoryRate && <div className="flex justify-between"><span className="text-muted-foreground">Respiratory Rate</span><span>{record.vitals.respiratoryRate} /min</span></div>}
              {record.vitals.oxygenSaturation && <div className="flex justify-between"><span className="text-muted-foreground">O2 Saturation</span><span>{record.vitals.oxygenSaturation}%</span></div>}
              {record.vitals.weight && <div className="flex justify-between"><span className="text-muted-foreground">Weight</span><span>{record.vitals.weight} kg</span></div>}
              {record.vitals.height && <div className="flex justify-between"><span className="text-muted-foreground">Height</span><span>{record.vitals.height} cm</span></div>}
            </CardContent>
          </Card>
        )}
        <Card className="md:col-span-2">
          <CardHeader><CardTitle className="text-lg">Consultation Notes</CardTitle></CardHeader>
          <CardContent><p className="text-sm whitespace-pre-wrap">{record.consultationNotes}</p></CardContent>
        </Card>
        {record.diagnosis && (
          <Card>
            <CardHeader><CardTitle className="text-lg">Diagnosis</CardTitle></CardHeader>
            <CardContent><p className="text-sm">{record.diagnosis}</p></CardContent>
          </Card>
        )}
        {record.treatmentPlan && (
          <Card>
            <CardHeader><CardTitle className="text-lg">Treatment Plan</CardTitle></CardHeader>
            <CardContent><p className="text-sm">{record.treatmentPlan}</p></CardContent>
          </Card>
        )}
        {record.aiSummary && (
          <Card className="md:col-span-2">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2">AI Summary <Badge variant="secondary">AI</Badge></CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground whitespace-pre-wrap">{record.aiSummary}</p></CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
