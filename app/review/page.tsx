"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  FileEdit,
  Save,
  Send,
  Shield,
  Sparkles,
  Stethoscope,
  User,
} from "lucide-react"
import ICDBadge from "@/components/ICDBadge"
import { SOAPNote } from "@/components/SOAPNote"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type SoapResult = {
  subjective?: string
  objective?: string
  assessment?: string
  plan?: string
  icd10?: Array<{ code: string; description: string; confidence: number; needsReview?: boolean }>
  nhso?: { covered?: boolean; note?: string }
}

const safetyChecklist = [
  { label: "No drug dosage hallucinated", passed: true },
  { label: "Missing fields marked as NOT SPECIFIED", passed: true },
  { label: "Doctor sign-off required", passed: false },
]

export default function ReviewPage() {
  const router = useRouter()
  const [data, setData] = useState<SoapResult | null>(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem("soapResult")
    if (raw) setData(JSON.parse(raw))
  }, [])

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <p className="text-sm text-muted-foreground">
          ไม่มีข้อมูล SOAP Note{" "}
          <button onClick={() => router.push("/")} className="text-primary underline">
            กลับหน้าอัปโหลด
          </button>
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="rounded-xl bg-primary/10 p-2">
              <Stethoscope className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Thai Ambient Clinical Copilot</h1>
              <p className="text-sm text-muted-foreground">30-Baht Edition</p>
            </div>
            <Badge variant="secondary" className="ml-auto border-emerald-200 bg-emerald-100 text-emerald-700">
              NHSO Compatible
            </Badge>
          </div>
        </div>
      </header>

      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-6 py-3">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Synthetic Patient</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline">OPD</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary" className="border-blue-200 bg-blue-100 text-blue-700">
                NHSO 30-Baht
              </Badge>
            </div>
            <Badge
              variant="outline"
              className={`ml-auto ${isSubmitted ? "border-emerald-300 bg-emerald-100 text-emerald-700" : "border-amber-300 bg-amber-100 text-amber-700"}`}
            >
              {isSubmitted ? "Submitted" : "Needs Doctor Review"}
            </Badge>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        {isSubmitted ? (
          <Card className="mx-auto max-w-xl rounded-2xl border shadow-lg">
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 w-fit rounded-full bg-emerald-100 p-4">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-foreground">Successfully Submitted</h2>
              <p className="mb-6 text-muted-foreground">SOAP Note ถูก sign-off แล้ว</p>
              <Button onClick={() => router.push("/")}>
                <ArrowLeft className="h-4 w-4" />
                Back to Upload
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-3">
              <div className="mb-4 flex items-center gap-2">
                <FileEdit className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">SOAP Note</h2>
                <Badge variant="outline" className="ml-2 text-xs">
                  AI Generated
                </Badge>
              </div>
              <SOAPNote data={data} />
            </div>

            <div className="space-y-6 lg:col-span-2">
              <Card className="rounded-2xl border shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">ICD-10 Suggestions</CardTitle>
                  </div>
                  <CardDescription>AI-suggested diagnosis codes based on clinical notes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.icd10?.length ? (
                    data.icd10.map((item, index) => <ICDBadge key={index} {...item} />)
                  ) : (
                    <p className="text-sm text-muted-foreground">No ICD-10 suggestions returned.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-2xl border shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">NHSO Coverage Status</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`rounded-xl border p-4 ${data.nhso?.covered === false ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"}`}>
                    <div className="flex items-center justify-between gap-3">
                      <p className={`text-sm font-medium ${data.nhso?.covered === false ? "text-red-800" : "text-emerald-800"}`}>
                        {data.nhso?.note || (data.nhso?.covered === false ? "Not covered" : "Covered under NHSO OPD pathway")}
                      </p>
                      <Badge className={data.nhso?.covered === false ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}>
                        {data.nhso?.covered === false ? "Not covered" : "Covered"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <CardTitle className="text-base">Safety Checklist</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {safetyChecklist.map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        {item.passed ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <AlertTriangle className="h-5 w-5 text-amber-500" />}
                        <span className={`text-sm ${item.passed ? "text-foreground" : "font-medium text-amber-700"}`}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {!isSubmitted && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button variant="outline" size="lg" onClick={() => router.push("/")}>
              <FileEdit className="h-4 w-4" />
              Edit Draft
            </Button>
            <Button variant="secondary" size="lg">
              <Save className="h-4 w-4" />
              Save as Draft
            </Button>
            <Button size="lg" onClick={() => setIsConfirmDialogOpen(true)}>
              <Send className="h-4 w-4" />
              Confirm & Submit
            </Button>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4" />
          <span>AI-generated output must be reviewed and signed off by a clinician.</span>
        </div>
      </main>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Doctor Sign-off Required
            </DialogTitle>
            <DialogDescription>
              By submitting, you confirm that you reviewed and corrected the AI-generated SOAP note.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsSubmitted(true)
                setIsConfirmDialogOpen(false)
              }}
            >
              <CheckCircle className="h-4 w-4" />
              Confirm Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
