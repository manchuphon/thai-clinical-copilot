interface Props {
  label: string
  content: string
  warning?: boolean
}

export default function SOAPSection({ label, content, warning }: Props) {
  function renderContent(text: string) {
    return text
      .replace(
        /\[NOT SPECIFIED\]/g,
        '<span class="bg-red-100 text-red-700 text-xs font-medium px-1.5 py-0.5 rounded">[NOT SPECIFIED]</span>'
      )
      .replace(
        /\[NEEDS REVIEW\]/g,
        '<span class="bg-yellow-100 text-yellow-700 text-xs font-medium px-1.5 py-0.5 rounded">[NEEDS REVIEW]</span>'
      )
  }

  return (
    <div className={`rounded-lg p-4 ${warning ? "bg-yellow-50 border border-yellow-100" : "bg-gray-50"}`}>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      <p
        className="text-sm text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: renderContent(content || "[NOT SPECIFIED]") }}
      />
    </div>
  )
}
