import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Thai Clinical Copilot - 30-Baht Edition",
  description: "AI ที่ช่วยจัดทำ SOAP Note และ ICD-10 สำหรับแพทย์ไทย",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-background">{children}</body>
    </html>
  )
}
