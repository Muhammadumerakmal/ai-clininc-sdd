"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Brain, Loader2 } from "lucide-react";

export default function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [requestType, setRequestType] = useState("symptom-analysis");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");
    try {
      const endpoints: Record<string, string> = {
        "symptom-analysis": "/ai/symptom-analysis",
        "diagnosis-suggestion": "/ai/diagnosis-suggestion",
        "prescription-draft": "/ai/prescription-draft",
        general: "/ai/chat",
      };
      const bodies: Record<string, unknown> = {
        "symptom-analysis": { symptoms: prompt.split("\n").filter(Boolean) },
        "diagnosis-suggestion": { symptoms: prompt.split("\n").filter(Boolean) },
        "prescription-draft": { diagnosis: prompt, patientId: "", doctorId: "" },
        general: { message: prompt },
      };
      const data = await api.post<{ response: string }>(endpoints[requestType], bodies[requestType]);
      setResponse(data.response);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="AI Assistant" description="AI-powered clinical assistance" />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5" /> New Request</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Request Type</Label>
                <Select value={requestType} onValueChange={(v) => setRequestType(v ?? "")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="symptom-analysis">Symptom Analysis</SelectItem>
                    <SelectItem value="diagnosis-suggestion">Diagnosis Suggestion</SelectItem>
                    <SelectItem value="prescription-draft">Prescription Draft</SelectItem>
                    <SelectItem value="general">General Query</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Your Question</Label>
                <Textarea
                  placeholder="Describe symptoms, ask for diagnosis suggestions, or request a prescription draft..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</> : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Response</CardTitle></CardHeader>
          <CardContent>
            {response ? (
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">{response}</div>
            ) : (
              <p className="text-muted-foreground text-sm">AI response will appear here...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
