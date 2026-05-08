// Hardcoded fallback — used when OpenAI API fails during demo
// This ensures demo never crashes during pitch

export const FALLBACK_RESPONSE = {
  subjective:
    "Chief complaint: Lower back pain, duration several days. Unable to lift heavy objects. No radiation to lower extremities reported.",
  objective:
    "Vital signs: [NOT SPECIFIED]\nPhysical examination: [NOT SPECIFIED]\nNote: Physical exam findings not verbalized during consultation.",
  assessment:
    "Possible mechanical low back pain (M54.5) [NEEDS REVIEW]\nDifferential diagnoses: Lumbar muscle strain, herniated intervertebral disc — requires physical examination and imaging for confirmation.",
  plan:
    "1. Paracetamol prescribed PRN (dose: [NOT SPECIFIED] — physician to specify)\n2. X-ray lumbar spine ordered\n3. Follow-up appointment scheduled",
  icd10: [
    {
      code: "M54.5",
      description: "Low back pain",
      confidence: 94,
    },
    {
      code: "M54.4",
      description: "Lumbago with sciatica",
      confidence: 38,
    },
  ],
  nhso: {
    covered: true,
    note: "การรักษาอาการปวดหลังและการถ่าย X-ray อยู่ในสิทธิบัตรทอง",
  },
}
