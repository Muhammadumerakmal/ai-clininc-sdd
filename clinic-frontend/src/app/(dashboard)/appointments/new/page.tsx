"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function NewAppointmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<{ id: string; firstName: string; lastName: string }[]>([]);
  const [doctors, setDoctors] = useState<{ id: string; user?: { name: string } }[]>([]);
  const [form, setForm] = useState({ patientId: "", doctorId: "", dateTime: "", reason: "" });

  useEffect(() => {
    api.get<{ patients: { id: string; firstName: string; lastName: string }[] }>("/patients?limit=100").then((d) => setPatients(d.patients || [])).catch(() => {});
    api.get<{ doctors: { id: string; user?: { name: string } }[] }>("/doctors?limit=100").then((d) => setDoctors(d.doctors || [])).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/appointments", form);
      toast.success("Appointment created");
      router.push("/appointments");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create appointment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="New Appointment" description="Book a new appointment" />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Patient</Label>
              <Select value={form.patientId} onValueChange={(v) => setForm({ ...form, patientId: v ?? "" })}>
                <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Doctor</Label>
              <Select value={form.doctorId} onValueChange={(v) => setForm({ ...form, doctorId: v ?? "" })}>
                <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                <SelectContent>
                  {doctors.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.user?.name || d.id}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date & Time</Label>
              <Input type="datetime-local" value={form.dateTime} onChange={(e) => setForm({ ...form, dateTime: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Appointment"}</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
