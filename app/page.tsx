"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  FileAudio,
  Loader2,
  MessageSquare,
  Sparkles,
  Stethoscope,
  Upload,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const processingSteps = ["อัปโหลดไฟล์เสียง", "ถอดเสียงด้วย AI", "ตรวจสอบ transcript", "พร้อมสร้าง SOAP note"]

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)

  async function handleTranscribe() {
    if (!file) return
    setLoading(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("audio", file)
      const res = await fetch("/api/transcribe", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || "Transcription failed")
      setTranscript(data.transcript)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateSOAP() {
    if (!transcript) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/generate-soap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || "SOAP generation failed")
      localStorage.setItem("soapResult", JSON.stringify(data))
      router.push("/review")
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function selectFile(nextFile?: File) {
    setError("")
    setTranscript("")
    setFile(nextFile || null)
  }

  const progress = transcript ? 100 : loading ? 60 : file ? 25 : 0

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
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

      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-2xl border shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                <CardTitle>Audio Upload</CardTitle>
              </div>
              <CardDescription>อัปโหลดไฟล์เสียงการสนทนา MP3</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <label
                onDragOver={(event) => {
                  event.preventDefault()
                  setIsDragOver(true)
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(event) => {
                  event.preventDefault()
                  setIsDragOver(false)
                  selectFile(event.dataTransfer.files?.[0])
                }}
                className={`block cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : file
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <input type="file" accept="audio/*" className="sr-only" onChange={(event) => selectFile(event.target.files?.[0])} />
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-full bg-emerald-100 p-3">
                      <FileAudio className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">พร้อมถอดเสียง</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-full bg-muted p-3">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">ลากไฟล์เสียงมาวางที่นี่</p>
                      <p className="text-sm text-muted-foreground">หรือคลิกเพื่อเลือกไฟล์</p>
                    </div>
                  </div>
                )}
              </label>

              <Button onClick={handleTranscribe} className="w-full" size="lg" disabled={!file || loading}>
                {loading && !transcript ? (
                  <>
                    <Loader2 className="animate-spin" />
                    กำลัง Transcribe...
                  </>
                ) : (
                  <>
                    <Sparkles />
                    Transcribe เสียง
                  </>
                )}
              </Button>

              {(file || loading || transcript) && (
                <div className="space-y-4">
                  <Progress value={progress} />
                  <div className="space-y-2">
                    {processingSteps.map((step, index) => {
                      const done = progress >= ((index + 1) / processingSteps.length) * 100
                      return (
                        <div key={step} className={`flex items-center gap-3 text-sm ${done ? "text-foreground" : "text-muted-foreground"}`}>
                          {done ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <div className="h-4 w-4 rounded-full border-2 border-muted" />}
                          <span>{step}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <CardTitle>Transcript Preview</CardTitle>
              </div>
              <CardDescription>ผลถอดเสียงที่จะส่งต่อให้ AI สร้าง SOAP Note</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {transcript ? (
                <>
                  <div className="max-h-[360px] overflow-auto rounded-xl bg-muted p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                    {transcript}
                  </div>
                  <Button onClick={handleGenerateSOAP} disabled={loading} className="w-full" size="lg">
                    {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                    สร้าง SOAP Note + ICD-10
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">อัปโหลดและถอดเสียงก่อน เพื่อดู transcript</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {error && <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4" />
          <span>AI-generated output must be reviewed and signed off by a clinician.</span>
        </div>
      </main>
    </div>
  )
}
