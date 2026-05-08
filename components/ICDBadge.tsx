interface Props {
  code: string
  description: string
  confidence: number
}

export default function ICDBadge({ code, description, confidence }: Props) {
  const color = confidence >= 85 ? "green" : confidence >= 70 ? "yellow" : "red"
  const colorMap: Record<string, string> = {
    green: "bg-green-50 border-green-200 text-green-800",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    red: "bg-red-50 border-red-200 text-red-800",
  }
  return (
    <div className={`flex items-center justify-between border rounded-lg px-4 py-3 ${colorMap[color]}`}>
      <div>
        <span className="font-mono font-semibold text-sm">{code}</span>
        <span className="mx-2 text-gray-300">—</span>
        <span className="text-sm">{description}</span>
      </div>
      <span className="text-xs font-semibold ml-4 shrink-0">{confidence}%</span>
    </div>
  )
}
