"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function NewDoctorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    userId: "", specialization: "", degree: "", institution: "", year: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        userId: form.userId,
        specialization: form.specialization,
      };
      if (form.degree && form.institution) {
        body.qualifications = [{ degree: form.degree, institution: form.institution, year: Number(form.year) || new Date().getFullYear() }];
      }
      await api.post("/doctors", body);
      toast.success("Doctor created");
      router.push("/doctors");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create doctor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="New Doctor" description="Add a new doctor" />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>User ID</Label>
              <Input value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} required placeholder="User ID from user management" />
            </div>
            <div className="space-y-2">
              <Label>Specialization</Label>
              <Input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} required />
            </div>
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">Qualification (optional)</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Doctor"}</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
