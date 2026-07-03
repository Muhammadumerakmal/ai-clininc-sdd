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

export default function NewPrescriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<{ id: string; firstName: string; lastName: string }[]>([]);
  const [doctors, setDoctors] = useState<{ id: string; user?: { name: string } }[]>([]);
  const [form, setForm] = useState({ patientId: "", doctorId: "", notes: "" });
  const [medications, setMedications] = useState([{ medicineId: "", name: "", dosage: "", frequency: "", duration: "", notes: "" }]);

  useEffect(() => {
    api.get<{ patients: { id: string; firstName: string; lastName: string }[] }>("/patients?limit=100").then((d) => setPatients(d.patients || [])).catch(() => {});
    api.get<{ doctors: { id: string; user?: { name: string } }[] }>("/doctors?limit=100").then((d) => setDoctors(d.doctors || [])).catch(() => {});
  }, []);

  function addMedication() {
    setMedications([...medications, { medicineId: "", name: "", dosage: "", frequency: "", duration: "", notes: "" }]);
  }

  function updateMedication(index: number, key: string, value: string) {
    const updated = medications.map((m, i) => i === index ? { ...m, [key]: value } : m);
    setMedications(updated);
  }

  function removeMedication(index: number) {
    setMedications(medications.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/prescriptions", {
        patientId: form.patientId,
        doctorId: form.doctorId,
        medications: medications.filter((m) => m.name && m.dosage),
        notes: form.notes || undefined,
      });
      toast.success("Prescription created");
      router.push("/prescriptions");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create prescription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="New Prescription" description="Create a new prescription" />
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
              <Label>Notes</Label>
              <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">Medications</p>
                <Button type="button" variant="outline" size="sm" onClick={addMedication}>Add Medication</Button>
              </div>
              {medications.map((med, i) => (
                <div key={i} className="p-3 mb-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">Medication #{i + 1}</span>
                    {medications.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" className="text-red-500 h-6 px-2" onClick={() => removeMedication(i)}>Remove</Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Name</Label><Input value={med.name} onChange={(e) => updateMedication(i, "name", e.target.value)} required /></div>
                    <div className="space-y-1"><Label className="text-xs">Medicine ID</Label><Input value={med.medicineId} onChange={(e) => updateMedication(i, "medicineId", e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Dosage</Label><Input placeholder="10mg" value={med.dosage} onChange={(e) => updateMedication(i, "dosage", e.target.value)} required /></div>
                    <div className="space-y-1"><Label className="text-xs">Frequency</Label><Input placeholder="Twice daily" value={med.frequency} onChange={(e) => updateMedication(i, "frequency", e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Duration</Label><Input placeholder="7 days" value={med.duration} onChange={(e) => updateMedication(i, "duration", e.target.value)} /></div>
                  </div>
                  <div className="mt-2">
                    <Input placeholder="Notes (optional)" value={med.notes} onChange={(e) => updateMedication(i, "notes", e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Prescription"}</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
