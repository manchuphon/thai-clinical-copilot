"use client"

import { AlertTriangle, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ICDBadgeProps {
  code: string
  description: string
  confidence: number
  needsReview?: boolean
}

export default function ICDBadge({ code, description, confidence, needsReview = false }: ICDBadgeProps) {
  const review = needsReview || confidence < 70
  const color = review
    ? "bg-amber-100 text-amber-800 border-amber-200"
    : confidence >= 90
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200"

  return (
    <div className={`flex items-start gap-3 rounded-xl border p-3 ${color}`}>
      <div className="mt-0.5">
        {review ? <AlertTriangle className="h-4 w-4 text-amber-600" /> : <CheckCircle className="h-4 w-4 text-emerald-600" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-semibold">{code}</span>
          <Badge variant="outline" className="border-current/40 bg-white/40 text-current">
            {confidence}% confidence
          </Badge>
          {review && (
            <Badge variant="outline" className="border-amber-400 bg-amber-50 text-amber-700">
              NEEDS REVIEW
            </Badge>
          )}
        </div>
        <p className="mt-1 text-sm text-current/80">{description}</p>
      </div>
    </div>
  )
}
