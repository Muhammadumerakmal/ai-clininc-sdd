"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Phone, Mail, MapPin } from "lucide-react";

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  departments?: { id: string; name: string }[];
}

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Clinic[]>("/clinics")
      .then(setClinics)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  return (
    <div>
      <PageHeader title="Clinics" description="Manage clinics and departments" />
      <div className="grid gap-4 md:grid-cols-2">
        {clinics.map((clinic) => (
          <Card key={clinic.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                {clinic.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" /> {clinic.address}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" /> {clinic.phone}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" /> {clinic.email}
              </div>
              {clinic.departments && clinic.departments.length > 0 && (
                <div className="pt-2">
                  <p className="text-muted-foreground mb-1">Departments:</p>
                  <div className="flex flex-wrap gap-1">
                    {clinic.departments.map((d) => (
                      <span key={d.id} className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs">{d.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
