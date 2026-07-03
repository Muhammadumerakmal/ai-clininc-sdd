"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  unit: string;
  stockQuantity: number;
  minStockLevel: number;
  price: number;
  isActive: boolean;
}

export default function PharmacyPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ medicines?: Medicine[] }>("/pharmacy")
      .then((d) => setMedicines(d.medicines || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "name", header: "Name" },
    { key: "genericName", header: "Generic Name" },
    { key: "category", header: "Category" },
    { key: "unit", header: "Unit" },
    { key: "stockQuantity", header: "Stock", cell: (m: Medicine) => (
      <span className={m.stockQuantity <= m.minStockLevel ? "text-red-600 font-medium" : ""}>
        {m.stockQuantity} {m.stockQuantity <= m.minStockLevel && "(Low)"}
      </span>
    )},
    { key: "price", header: "Price", cell: (m: Medicine) => `$${m.price.toFixed(2)}` },
    { key: "isActive", header: "Status", cell: (m: Medicine) => m.isActive ? <StatusBadge status="Active" /> : <StatusBadge status="Inactive" /> },
  ];

  return (
    <div>
      <PageHeader title="Pharmacy" description="Medicine inventory" />
      <DataTable columns={columns} data={medicines} loading={loading} />
    </div>
  );
}
