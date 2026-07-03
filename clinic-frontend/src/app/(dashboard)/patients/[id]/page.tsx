"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email?: string;
  address?: string;
  bloodGroup?: string;
  medicalHistory?: string[];
  allergies?: string[];
  emergencyContact?: { name: string; phone: string; relationship: string };
}

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    api.get<Patient>(`/patients/${id}`).then(setPatient).catch(() => router.push("/patients"));
  }, [id, router]);

  if (!patient) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  return (
    <div>
      <PageHeader title={`${patient.firstName} ${patient.lastName}`} description="Patient details">
        <Link href={`/patients/${id}/edit`}><Button variant="outline"><Edit className="h-4 w-4 mr-2" />Edit</Button></Link>
        <Button variant="outline" onClick={() => router.push("/patients")}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Gender</span><span>{patient.gender}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">DOB</span><span>{new Date(patient.dateOfBirth).toLocaleDateString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Blood Group</span><span>{patient.bloodGroup || "-"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{patient.phone}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{patient.email || "-"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span>{patient.address || "-"}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Medical Info</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Medical History</p>
              <div className="flex flex-wrap gap-1">
                {patient.medicalHistory?.length ? patient.medicalHistory.map((m, i) => <Badge key={i} variant="secondary">{m}</Badge>) : <span className="text-muted-foreground">None</span>}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Allergies</p>
              <div className="flex flex-wrap gap-1">
                {patient.allergies?.length ? patient.allergies.map((a, i) => <Badge key={i} variant="destructive">{a}</Badge>) : <span className="text-muted-foreground">None</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
