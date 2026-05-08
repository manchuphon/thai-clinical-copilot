"use client"

import { Brain, ClipboardList, FileText, Stethoscope } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type SOAPData = {
  subjective?: string
  objective?: string
  assessment?: string
  plan?: string
}

const sections = [
  { key: "subjective", title: "Subjective", icon: FileText },
  { key: "objective", title: "Objective", icon: Stethoscope },
  { key: "assessment", title: "Assessment", icon: Brain },
  { key: "plan", title: "Plan", icon: ClipboardList },
] as const

function renderBadges(content: string) {
  const flags = ["NOT SPECIFIED", "NEEDS REVIEW"].filter((flag) => content.includes(`[${flag}]`))

  return flags.map((flag) => (
    <Badge
      key={flag}
      variant={flag === "NOT SPECIFIED" ? "destructive" : "outline"}
      className={flag === "NEEDS REVIEW" ? "border-amber-300 bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}
    >
      {flag}
    </Badge>
  ))
}

export function SOAPNote({ data }: { data: SOAPData }) {
  return (
    <div className="space-y-4">
      {sections.map(({ key, title, icon: Icon }) => {
        const content = data[key] || "[NOT SPECIFIED]"

        return (
          <Card key={key} className="rounded-2xl border shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-2">{renderBadges(content)}</div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{content}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
