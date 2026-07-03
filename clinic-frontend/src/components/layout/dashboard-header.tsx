"use client";

import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut } from "lucide-react";
import Link from "next/link";

export function DashboardHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-3">
        <Link href="/notifications" className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-accent">
          <Bell className="h-4 w-4" />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-2 rounded-lg hover:bg-accent cursor-pointer">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs">
                {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-left text-sm leading-tight hidden md:block">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
