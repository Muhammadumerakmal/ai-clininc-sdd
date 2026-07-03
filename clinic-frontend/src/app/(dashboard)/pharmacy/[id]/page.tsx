"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  unit: string;
  price: number;
  stockQuantity: number;
  minStockLevel: number;
  isActive: boolean;
}

export default function MedicineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [medicine, setMedicine] = useState<Medicine | null>(null);

  useEffect(() => {
    api.get<Medicine>(`/pharmacy/${id}`).then(setMedicine).catch(() => router.push("/pharmacy"));
  }, [id, router]);

  if (!medicine) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  const isLowStock = medicine.stockQuantity <= medicine.minStockLevel;

  return (
    <div>
      <PageHeader title={medicine.name} description={medicine.genericName}>
        <Button variant="outline" onClick={() => router.push("/pharmacy")}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Medicine Details</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span>{medicine.name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Generic Name</span><span>{medicine.genericName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span>{medicine.category}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Unit</span><span>{medicine.unit}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Price</span><span>{formatCurrency(medicine.price)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span>{medicine.isActive ? <StatusBadge status="Active" /> : <StatusBadge status="Inactive" />}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Stock Information</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Stock Quantity</span>
              <span className={isLowStock ? "text-red-600 font-medium" : ""}>{medicine.stockQuantity} {medicine.unit}</span>
            </div>
            <div className="flex justify-between"><span className="text-muted-foreground">Min Stock Level</span><span>{medicine.minStockLevel}</span></div>
            {isLowStock && <p className="text-red-600 text-xs font-medium mt-2">⚠ Low stock — reorder soon</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
