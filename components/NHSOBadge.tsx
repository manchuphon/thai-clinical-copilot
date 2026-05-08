interface Props {
  covered: boolean
  note?: string
}

export default function NHSOBadge({ covered, note }: Props) {
  return (
    <div
      className={`rounded-lg px-4 py-3 border ${
        covered
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-red-50 border-red-200 text-red-800"
      }`}
    >
      <p className="text-sm font-semibold">
        {covered ? "✓ อยู่ในสิทธิบัตรทอง" : "✗ ไม่อยู่ในสิทธิบัตรทอง — แจ้งคนไข้ก่อน"}
      </p>
      {note && <p className="text-xs mt-1 opacity-80">{note}</p>}
    </div>
  )
}
