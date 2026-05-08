"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState("")

  async function handleTranscribe() {
    if (!file) return
    setLoading(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("audio", file)
      const res = await fetch("/api/transcribe", { method: "POST", body: formData })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
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
    try {
      const res = await fetch("/api/generate-soap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      })
      const data = await res.json()
      localStorage.setItem("soapResult", JSON.stringify(data))
      router.push("/review")
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          30-Baht Edition
        </span>
        <h1 className="mt-3 text-2xl font-semibold text-gray-900">
          Thai Clinical Copilot
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          อัปโหลดเสียงบทสนทนา → AI สร้าง SOAP Note + ICD-10
        </p>
      </div>

      {/* Upload */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          อัปโหลดไฟล์เสียง (MP3 / WAV / M4A)
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {file && <p className="mt-2 text-xs text-gray-400">✓ {file.name}</p>}
        <button
          onClick={handleTranscribe}
          disabled={!file || loading}
          className="mt-4 w-full py-2.5 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading && !transcript ? "กำลัง Transcribe..." : "Transcribe เสียง"}
        </button>
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <h2 className="text-sm font-medium text-gray-700 mb-3">Transcript</h2>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {transcript}
          </div>
          <button
            onClick={handleGenerateSOAP}
            disabled={loading}
            className="mt-4 w-full py-2.5 px-4 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-40"
          >
            {loading ? "กำลังสร้าง SOAP Note..." : "สร้าง SOAP Note + ICD-10 →"}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </main>
  )
}
