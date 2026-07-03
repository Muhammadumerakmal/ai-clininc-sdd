"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, DollarSign, FileText } from "lucide-react";

interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  totalInvoices: number;
  totalRevenue: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    api.get<DashboardStats>("/reports/dashboard").then(setStats).catch(() => {});
  }, []);

  const cards = [
    { title: "Total Patients", value: stats?.totalPatients ?? 0, icon: Users, color: "text-blue-600" },
    { title: "Total Doctors", value: stats?.totalDoctors ?? 0, icon: FileText, color: "text-green-600" },
    { title: "Appointments", value: stats?.totalAppointments ?? 0, icon: Calendar, color: "text-purple-600" },
    { title: "Revenue", value: stats ? `$${stats.totalRevenue.toLocaleString()}` : "$0", icon: DollarSign, color: "text-yellow-600" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your clinic" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
