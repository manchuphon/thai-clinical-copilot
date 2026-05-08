import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Thai Clinical Copilot — 30-Baht Edition",
  description: "AI ที่คืนเวลาให้หมอไทย",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
