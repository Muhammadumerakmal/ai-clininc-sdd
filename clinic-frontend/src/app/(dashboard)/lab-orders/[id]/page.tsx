"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface LabOrder {
  id: string;
  patientId: { firstName: string; lastName: string };
  doctorId: { user?: { name: string } };
  medicalRecordId?: string;
  testName: string;
  instructions?: string;
  status: string;
  result?: string;
  resultFile?: string;
  reviewedByDoctor: boolean;
  reviewedAt?: string;
  createdAt: string;
}

export default function LabOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<LabOrder | null>(null);

  useEffect(() => {
    api.get<LabOrder>(`/lab-orders/${id}`).then(setOrder).catch(() => router.push("/lab-orders"));
  }, [id, router]);

  if (!order) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  return (
    <div>
      <PageHeader title={order.testName} description={`Ordered ${formatDate(order.createdAt)}`}>
        <Button variant="outline" onClick={() => router.push("/lab-orders")}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Order Details</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Test Name</span><span>{order.testName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><StatusBadge status={order.status} /></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Patient</span><span>{order.patientId ? `${order.patientId.firstName} ${order.patientId.lastName}` : "-"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Ordered By</span><span>{order.doctorId?.user?.name || "-"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Ordered At</span><span>{formatDate(order.createdAt)}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Instructions & Review</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="text-muted-foreground block mb-1">Instructions</span><p>{order.instructions || "-"}</p></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Reviewed</span>{order.reviewedByDoctor ? <Badge variant="secondary">Reviewed</Badge> : <Badge variant="outline">Pending Review</Badge>}</div>
            {order.reviewedAt && <div className="flex justify-between"><span className="text-muted-foreground">Reviewed At</span><span>{formatDate(order.reviewedAt)}</span></div>}
          </CardContent>
        </Card>
        {order.result && (
          <Card className="md:col-span-2">
            <CardHeader><CardTitle className="text-lg">Result</CardTitle></CardHeader>
            <CardContent><p className="text-sm whitespace-pre-wrap">{order.result}</p></CardContent>
          </Card>
        )}
        {order.resultFile && (
          <Card className="md:col-span-2">
            <CardHeader><CardTitle className="text-lg">Result File</CardTitle></CardHeader>
            <CardContent>
              <a href={order.resultFile} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">View attached file</a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
