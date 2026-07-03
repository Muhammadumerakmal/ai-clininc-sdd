"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  totalInvoices: number;
  totalRevenue: number;
}

interface RevenueItem {
  _id: string;
  total: number;
  count: number;
  paid: number;
}

interface AppointmentStats {
  _id: string;
  count: number;
}

export default function ReportsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenue, setRevenue] = useState<RevenueItem[]>([]);
  const [appointments, setAppointments] = useState<AppointmentStats[]>([]);

  useEffect(() => {
    api.get<DashboardStats>("/reports/dashboard").then(setStats).catch(() => {});
    api.get<{ data: RevenueItem[] }>("/reports/revenue?from=2020-01-01&to=2030-12-31").then((d) => setRevenue(d.data || [])).catch(() => {});
    api.get<{ data: AppointmentStats[] }>("/reports/appointments?from=2020-01-01&to=2030-12-31").then((d) => setAppointments(d.data || [])).catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader title="Reports" description="Analytics and insights" />
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Patients</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats?.totalPatients ?? 0}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Doctors</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats?.totalDoctors ?? 0}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Appointments</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats?.totalAppointments ?? 0}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Revenue</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats ? formatCurrency(stats.totalRevenue) : "$0"}</p></CardContent></Card>
      </div>
      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue">
          <Card>
            <CardHeader><CardTitle>Daily Revenue</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Invoices</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenue.map((r) => (
                    <TableRow key={r._id}>
                      <TableCell>{r._id}</TableCell>
                      <TableCell>{r.count}</TableCell>
                      <TableCell>{formatCurrency(r.total)}</TableCell>
                      <TableCell>{formatCurrency(r.paid)}</TableCell>
                    </TableRow>
                  ))}
                  {revenue.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No data</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appointments">
          <Card>
            <CardHeader><CardTitle>Appointments by Status</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Status</TableHead><TableHead>Count</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((a) => (
                    <TableRow key={a._id}>
                      <TableCell>{a._id}</TableCell>
                      <TableCell>{a.count}</TableCell>
                    </TableRow>
                  ))}
                  {appointments.length === 0 && (
                    <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">No data</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
