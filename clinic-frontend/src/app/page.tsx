"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  Pill,
  BarChart3,
  Bot,
  Users,
  Bell,
  ArrowRight,
  Stethoscope,
  Shield,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";

const features = [
  {
    icon: CalendarCheck,
    title: "Appointment Management",
    description: "Schedule, reschedule, and track patient appointments with real-time availability and queue management.",
  },
  {
    icon: Pill,
    title: "Pharmacy & Inventory",
    description: "Manage medicine stock, dispense prescriptions, and get low-stock alerts automatically.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description: "Generate revenue reports, appointment statistics, and gain insights into clinic performance.",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description: "Leverage AI for symptom analysis, diagnosis suggestions, and prescription drafting assistance.",
  },
  {
    icon: Users,
    title: "Patient Management",
    description: "Maintain comprehensive patient records, medical history, and emergency contacts in one place.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Send and manage notifications across email, SMS, and in-app channels with read tracking.",
  },
];

const steps = [
  {
    icon: Users,
    title: "Create Your Account",
    description: "Sign up as a clinic admin, doctor, or staff member in under a minute.",
  },
  {
    icon: Shield,
    title: "Configure Your Clinic",
    description: "Set up departments, working hours, and staff roles tailored to your practice.",
  },
  {
    icon: Clock,
    title: "Start Managing",
    description: "Book appointments, manage patients, and streamline your clinic operations.",
  },
];

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={() => router.push("/")} className="flex items-center gap-2 cursor-pointer" type="button">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Stethoscope className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">AI Clinic</span>
          </button>
          <nav className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.push("/login")}>
              Log in
            </Button>
            <Button onClick={() => router.push("/register")}>
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 sm:py-32 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-1.5 text-sm text-muted-foreground">
                <Bot className="h-4 w-4" />
                AI-Powered Clinic Management
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Smart Clinic
                <br />
                <span className="text-primary">Management System</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                Streamline your clinic operations with intelligent appointment scheduling,
                patient records, pharmacy management, and AI-assisted diagnostics — all in one platform.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" onClick={() => router.push("/register")}>
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => router.push("/login")}>
                  Sign In
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </section>

        <section className="py-20 sm:py-28" id="features">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to run your clinic
              </h2>
              <p className="mt-4 text-muted-foreground">
                Comprehensive tools designed for modern healthcare practices.
              </p>
            </div>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="transition-shadow hover:shadow-md">
                    <CardContent className="flex flex-col items-start gap-4 pt-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/30 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Get started in 3 simple steps
              </h2>
              <p className="mt-4 text-muted-foreground">
                From sign-up to full operation in minutes.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="relative text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="mt-2 flex items-center justify-center">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="mt-4 font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Stethoscope className="h-4 w-4" />
            <span>AI Clinic Management System</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AI Clinic. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
