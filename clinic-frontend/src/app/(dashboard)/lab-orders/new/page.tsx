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

export default function NewLabOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<{ id: string; firstName: string; lastName: string }[]>([]);
  const [doctors, setDoctors] = useState<{ id: string; user?: { name: string } }[]>([]);
  const [form, setForm] = useState({ patientId: "", doctorId: "", testName: "", instructions: "" });

  useEffect(() => {
    api.get<{ patients: { id: string; firstName: string; lastName: string }[] }>("/patients?limit=100").then((d) => setPatients(d.patients || [])).catch(() => {});
    api.get<{ doctors: { id: string; user?: { name: string } }[] }>("/doctors?limit=100").then((d) => setDoctors(d.doctors || [])).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/lab-orders", form);
      toast.success("Lab order created");
      router.push("/lab-orders");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create lab order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="New Lab Order" description="Order a lab test" />
      <Card className="max-w-2xl">
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
                <Label>Ordered By</Label>
                <Select value={form.doctorId} onValueChange={(v) => setForm({ ...form, doctorId: v ?? "" })}>
                  <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                  <SelectContent>
                    {doctors.map((d) => (<SelectItem key={d.id} value={d.id}>{d.user?.name || d.id}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Test Name</Label>
              <Input value={form.testName} onChange={(e) => setForm({ ...form, testName: e.target.value })} required placeholder="e.g. Complete Blood Count" />
            </div>
            <div className="space-y-2">
              <Label>Instructions</Label>
              <Textarea rows={3} value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} placeholder="Special handling, fasting required, etc." />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Lab Order"}</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
