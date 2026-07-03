"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Medication {
  medicineId: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

interface Prescription {
  id: string;
  patientId: { firstName: string; lastName: string };
  doctorId: { user?: { name: string } };
  medications: Medication[];
  notes?: string;
  isAIGenerated: boolean;
  requiresDoctorApproval: boolean;
  approvedAt?: string;
  createdAt: string;
}

export default function PrescriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [prescription, setPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    api.get<Prescription>(`/prescriptions/${id}`).then(setPrescription).catch(() => router.push("/prescriptions"));
  }, [id, router]);

  if (!prescription) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  return (
    <div>
      <PageHeader title="Prescription" description={`Created ${formatDate(prescription.createdAt)}`}>
        <Button variant="outline" onClick={() => router.push("/prescriptions")}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Details</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Patient</span><span>{prescription.patientId ? `${prescription.patientId.firstName} ${prescription.patientId.lastName}` : "-"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Doctor</span><span>{prescription.doctorId?.user?.name || "-"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span>{prescription.approvedAt ? <StatusBadge status="Approved" /> : <StatusBadge status="Pending" />}</div>
            <div className="flex justify-between"><span className="text-muted-foreground">AI Generated</span>{prescription.isAIGenerated ? <Badge variant="secondary">AI</Badge> : <span>No</span>}</div>
            <div className="flex justify-between"><span className="text-muted-foreground">Requires Approval</span><span>{prescription.requiresDoctorApproval ? "Yes" : "No"}</span></div>
            {prescription.approvedAt && <div className="flex justify-between"><span className="text-muted-foreground">Approved At</span><span>{formatDate(prescription.approvedAt)}</span></div>}
          </CardContent>
        </Card>
        {prescription.notes && (
          <Card>
            <CardHeader><CardTitle className="text-lg">Notes</CardTitle></CardHeader>
            <CardContent><p className="text-sm">{prescription.notes}</p></CardContent>
          </Card>
        )}
      </div>
      <Card className="mt-4">
        <CardHeader><CardTitle className="text-lg">Medications</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescription.medications.map((m, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{m.dosage}</TableCell>
                  <TableCell>{m.frequency}</TableCell>
                  <TableCell>{m.duration}</TableCell>
                  <TableCell className="text-muted-foreground">{m.notes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
