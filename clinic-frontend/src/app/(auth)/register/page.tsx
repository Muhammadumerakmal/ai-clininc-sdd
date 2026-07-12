"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Patient", clinicId: "" });
  const [loading, setLoading] = useState(false);
  const [showClinicForm, setShowClinicForm] = useState(false);
  const [clinicForm, setClinicForm] = useState({ name: "", address: "", phone: "", email: "" });
  const [creatingClinic, setCreatingClinic] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { clinicId, ...rest } = form;
      await register(clinicId ? form : rest);
      toast.success("Registration successful. Please sign in.");
      router.push("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function createClinic(e: React.FormEvent) {
    e.preventDefault();
    setCreatingClinic(true);
    try {
      const res = await api.post<{ _id: string; name: string }>("/clinics/quick-create", clinicForm);
      setForm({ ...form, clinicId: res._id });
      setShowClinicForm(false);
      toast.success(`Clinic "${res.name}" created! ID copied to field.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create clinic");
    } finally {
      setCreatingClinic(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>Register for AI Clinic</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v ?? "" })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Patient">Patient</SelectItem>
                <SelectItem value="Doctor">Doctor</SelectItem>
                <SelectItem value="Nurse">Nurse</SelectItem>
                <SelectItem value="Receptionist">Receptionist</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Clinic ID</Label>
            <div className="flex gap-2">
              <Input placeholder="Paste your clinic ID" value={form.clinicId} onChange={(e) => setForm({ ...form, clinicId: e.target.value })} />
              <Button type="button" variant="outline" size="icon" onClick={() => setShowClinicForm(!showClinicForm)} title="Create new clinic">
                +
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Required to create patients.</p>
          </div>

          {showClinicForm && (
            <div className="border rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium">Create a new clinic</p>
              <Input placeholder="Clinic name" value={clinicForm.name} onChange={(e) => setClinicForm({ ...clinicForm, name: e.target.value })} required />
              <Input placeholder="Address" value={clinicForm.address} onChange={(e) => setClinicForm({ ...clinicForm, address: e.target.value })} required />
              <Input placeholder="Phone" value={clinicForm.phone} onChange={(e) => setClinicForm({ ...clinicForm, phone: e.target.value })} required />
              <Input type="email" placeholder="Email" value={clinicForm.email} onChange={(e) => setClinicForm({ ...clinicForm, email: e.target.value })} required />
              <Button type="button" size="sm" className="w-full" onClick={createClinic} disabled={creatingClinic}>
                {creatingClinic ? "Creating..." : "Create Clinic"}
              </Button>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
