"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  Building2,
  FileText,
  Pill,
  FlaskConical,
  Syringe,
  DollarSign,
  Bell,
  BarChart3,
  Brain,
  LogOut,
} from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["*"] },
  { href: "/patients", label: "Patients", icon: Users, roles: ["SuperAdmin", "ClinicAdmin", "Doctor", "Nurse", "Receptionist"] },
  { href: "/appointments", label: "Appointments", icon: Calendar, roles: ["SuperAdmin", "ClinicAdmin", "Doctor", "Nurse", "Receptionist"] },
  { href: "/doctors", label: "Doctors", icon: Stethoscope, roles: ["SuperAdmin", "ClinicAdmin"] },
  { href: "/clinics", label: "Clinics", icon: Building2, roles: ["SuperAdmin", "ClinicAdmin"] },
  { href: "/medical-records", label: "Medical Records", icon: FileText, roles: ["SuperAdmin", "ClinicAdmin", "Doctor", "Nurse"] },
  { href: "/prescriptions", label: "Prescriptions", icon: Pill, roles: ["SuperAdmin", "ClinicAdmin", "Doctor"] },
  { href: "/lab-orders", label: "Lab Orders", icon: FlaskConical, roles: ["SuperAdmin", "ClinicAdmin", "Doctor", "LabTechnician"] },
  { href: "/pharmacy", label: "Pharmacy", icon: Syringe, roles: ["SuperAdmin", "ClinicAdmin", "Pharmacist"] },
  { href: "/billing", label: "Billing", icon: DollarSign, roles: ["SuperAdmin", "ClinicAdmin"] },
  { href: "/reports", label: "Reports", icon: BarChart3, roles: ["SuperAdmin", "ClinicAdmin"] },
  { href: "/ai", label: "AI Assistant", icon: Brain, roles: ["SuperAdmin", "ClinicAdmin", "Doctor"] },
  { href: "/notifications", label: "Notifications", icon: Bell, roles: ["*"] },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const visibleItems = menuItems.filter(
    (item) => item.roles.includes("*") || (user && item.roles.includes(user.role))
  );

  return (
    <aside className="w-64 border-r bg-sidebar flex flex-col h-screen">
      <div className="p-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Brain className="h-6 w-6 text-primary" />
          <span>AI Clinic</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={active ? "secondary" : "ghost"}
                  className={cn("w-full justify-start gap-3", active && "bg-sidebar-accent text-sidebar-accent-foreground")}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="p-3 border-t">
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
