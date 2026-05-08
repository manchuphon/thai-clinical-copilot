"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SOAPSection from "@/components/SOAPSection"
import ICDBadge from "@/components/ICDBadge"
import NHSOBadge from "@/components/NHSOBadge"

export default function ReviewPage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem("soapResult")
    if (raw) setData(JSON.parse(raw))
  }, [])

  if (!data) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-400 text-sm">
        ไม่มีข้อมูล —{" "}
        <button onClick={() => router.push("/")} className="text-blue-600 underline">
          กลับหน้าหลัก
        </button>
      </p>
    </div>
  )

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Doctor Review</h1>
          <p className="text-xs text-gray-400 mt-0.5">ตรวจสอบและ Sign-off ก่อน Submit</p>
        </div>
        <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1 rounded-full font-medium">
          Pending Review
        </span>
      </div>

      {/* SOAP Note */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4 space-y-5">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">SOAP Note</h2>
        <SOAPSection label="S — Subjective" content={data.subjective} />
        <SOAPSection label="O — Objective" content={data.objective} />
        <SOAPSection label="A — Assessment" content={data.assessment} warning />
        <SOAPSection label="P — Plan" content={data.plan} />
      </div>

      {/* ICD-10 */}
      {data.icd10?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            ICD-10 Suggestions
          </h2>
          <div className="space-y-2">
            {data.icd10.map((item: any, i: number) => (
              <ICDBadge
                key={i}
                code={item.code}
                description={item.description}
                confidence={item.confidence}
              />
            ))}
          </div>
        </div>
      )}

      {/* NHSO */}
      {data.nhso && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            สิทธิบัตรทอง (NHSO)
          </h2>
          <NHSOBadge covered={data.nhso.covered} note={data.nhso.note} />
        </div>
      )}

      {/* AI Safety Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-xs text-amber-800">
        <span className="font-semibold">⚠️ AI Assistive Tool Only</span> — ข้อมูลนี้สร้างโดย AI
        เพื่อช่วยจัดทำเอกสาร แพทย์ต้องตรวจสอบและยืนยันความถูกต้องทุกครั้งก่อน Submit
      </div>

      {/* Actions */}
      {!submitted ? (
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
          >
            ← แก้ไข
          </button>
          <button
            onClick={() => setSubmitted(true)}
            className="flex-1 py-2.5 px-4 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
          >
            ✓ Confirm & Submit
          </button>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <p className="text-green-700 font-semibold text-lg">✓ บันทึกเรียบร้อย</p>
          <p className="text-green-600 text-sm mt-1">SOAP Note ถูก Sign-off โดยแพทย์แล้ว</p>
          <button onClick={() => router.push("/")} className="mt-4 text-sm text-green-700 underline">
            ตรวจคนไข้รายถัดไป
          </button>
        </div>
      )}
    </main>
  )
}
