"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function NewMedicalRecordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<{ id: string; firstName: string; lastName: string }[]>([]);
  const [doctors, setDoctors] = useState<{ id: string; user?: { name: string } }[]>([]);
  const [form, setForm] = useState({
    patientId: "", doctorId: "", appointmentId: "",
    consultationNotes: "", diagnosis: "", treatmentPlan: "",
    bloodPressure: "", heartRate: "", temperature: "", respiratoryRate: "", oxygenSaturation: "", weight: "", height: "",
  });

  useEffect(() => {
    api.get<{ patients: { id: string; firstName: string; lastName: string }[] }>("/patients?limit=100").then((d) => setPatients(d.patients || [])).catch(() => {});
    api.get<{ doctors: { id: string; user?: { name: string } }[] }>("/doctors?limit=100").then((d) => setDoctors(d.doctors || [])).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        patientId: form.patientId,
        doctorId: form.doctorId,
        consultationNotes: form.consultationNotes,
      };
      if (form.appointmentId) body.appointmentId = form.appointmentId;
      if (form.diagnosis) body.diagnosis = form.diagnosis;
      if (form.treatmentPlan) body.treatmentPlan = form.treatmentPlan;
      const vitals: Record<string, unknown> = {};
      if (form.bloodPressure) vitals.bloodPressure = form.bloodPressure;
      if (form.heartRate) vitals.heartRate = Number(form.heartRate);
      if (form.temperature) vitals.temperature = Number(form.temperature);
      if (form.respiratoryRate) vitals.respiratoryRate = Number(form.respiratoryRate);
      if (form.oxygenSaturation) vitals.oxygenSaturation = Number(form.oxygenSaturation);
      if (form.weight) vitals.weight = Number(form.weight);
      if (form.height) vitals.height = Number(form.height);
      if (Object.keys(vitals).length) body.vitals = vitals;
      await api.post("/medical-records", body);
      toast.success("Medical record created");
      router.push("/medical-records");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create medical record");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="New Medical Record" description="Document a consultation" />
      <Card className="max-w-3xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Patient</Label>
                <Select value={form.patientId} onValueChange={(v) => setForm({ ...form, patientId: v ?? "" })}>
                  <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                  <SelectContent>
                    {patients.map((p) => (<SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Doctor</Label>
                <Select value={form.doctorId} onValueChange={(v) => setForm({ ...form, doctorId: v ?? "" })}>
                  <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                  <SelectContent>
                    {doctors.map((d) => (<SelectItem key={d.id} value={d.id}>{d.user?.name || d.id}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Consultation Notes</Label>
              <Textarea rows={4} value={form.consultationNotes} onChange={(e) => setForm({ ...form, consultationNotes: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Diagnosis</Label>
              <Input value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Treatment Plan</Label>
              <Textarea rows={3} value={form.treatmentPlan} onChange={(e) => setForm({ ...form, treatmentPlan: e.target.value })} />
            </div>
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Vitals (optional)</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs">Blood Pressure</Label><Input placeholder="120/80" value={form.bloodPressure} onChange={(e) => setForm({ ...form, bloodPressure: e.target.value })} /></div>
                <div className="space-y-1"><Label className="text-xs">Heart Rate (bpm)</Label><Input type="number" value={form.heartRate} onChange={(e) => setForm({ ...form, heartRate: e.target.value })} /></div>
                <div className="space-y-1"><Label className="text-xs">Temperature (°F)</Label><Input type="number" step="0.1" value={form.temperature} onChange={(e) => setForm({ ...form, temperature: e.target.value })} /></div>
                <div className="space-y-1"><Label className="text-xs">Respiratory Rate</Label><Input type="number" value={form.respiratoryRate} onChange={(e) => setForm({ ...form, respiratoryRate: e.target.value })} /></div>
                <div className="space-y-1"><Label className="text-xs">O2 Saturation (%)</Label><Input type="number" value={form.oxygenSaturation} onChange={(e) => setForm({ ...form, oxygenSaturation: e.target.value })} /></div>
                <div className="space-y-1"><Label className="text-xs">Weight (kg)</Label><Input type="number" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} /></div>
                <div className="space-y-1"><Label className="text-xs">Height (cm)</Label><Input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} /></div>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Record"}</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
