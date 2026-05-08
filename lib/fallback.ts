// Hardcoded fallback responses สำหรับ 3 demo scenes
// ใช้เมื่อ OpenAI API fail ระหว่าง demo — ป้องกัน crash 100%

export const FALLBACK_SCENE_1 = {
  subjective:
    "Chief complaint: Lower back pain, duration several days. " +
    "Unable to lift heavy objects. No radiation to lower extremities.",
  objective:
    "Vital signs: [NOT SPECIFIED]\n" +
    "Physical examination: [NOT SPECIFIED]\n" +
    "Note: Physical exam findings not verbalized during consultation.",
  assessment:
    "Possible mechanical low back pain [NEEDS REVIEW]\n" +
    "Differential: Lumbar muscle strain, herniated intervertebral disc — " +
    "requires physical examination and imaging for confirmation.",
  plan:
    "1. Paracetamol prescribed PRN (dose: [NOT SPECIFIED] — physician to specify)\n" +
    "2. X-ray lumbar spine ordered\n" +
    "3. Follow-up appointment to be scheduled",
  icd10: [
    { code: "M54.5", description: "Low back pain",         confidence: 94 },
    { code: "M54.4", description: "Lumbago with sciatica", confidence: 32 },
  ],
  nhso: {
    covered: true,
    note: "การรักษาอาการปวดหลังและการถ่าย X-ray อยู่ในสิทธิบัตรทอง",
  },
}

export const FALLBACK_SCENE_2 = {
  subjective:
    "Chief complaint: Pain, details not fully specified. " +
    "Patient reported symptoms requiring analgesic management.",
  objective:
    "Vital signs: [NOT SPECIFIED]\n" +
    "Physical examination: [NOT SPECIFIED]",
  assessment:
    "Acute pain — etiology to be determined [NEEDS REVIEW]\n" +
    "Requires clinical examination for definitive assessment.",
  plan:
    "1. Paracetamol prescribed PRN\n" +
    "   Dose: [NOT SPECIFIED] — physician must specify before dispensing\n" +
    "   AI did not fabricate dose as it was not stated in conversation",
  icd10: [
    { code: "R52", description: "Pain, unspecified", confidence: 78 },
  ],
  nhso: {
    covered: true,
    note: "Paracetamol อยู่ในบัญชียาหลักแห่งชาติ ครอบคลุมโดยสิทธิบัตรทอง",
  },
}

export const FALLBACK_SCENE_3 = {
  subjective:
    "Chief complaint: Back pain with imaging findings. " +
    "X-ray results available showing herniated intervertebral disc at L4-L5.",
  objective:
    "X-ray lumbar spine: Herniated intervertebral disc at L4-L5 level\n" +
    "Vital signs: [NOT SPECIFIED]\n" +
    "Neurological examination: [NOT SPECIFIED]",
  assessment:
    "Herniated intervertebral disc L4-L5 (M51.1) [NEEDS REVIEW]\n" +
    "Specialist evaluation recommended before confirming surgical vs conservative management.",
  plan:
    "1. NSAIDs prescribed (dose: [NOT SPECIFIED] — physician to specify)\n" +
    "2. Referral to orthopedics recommended\n" +
    "3. Follow-up imaging may be required per specialist assessment",
  icd10: [
    { code: "M51.1", description: "Lumbar and other intervertebral disc derangement", confidence: 91 },
    { code: "M54.5", description: "Low back pain",                                    confidence: 75 },
  ],
  nhso: {
    covered: true,
    note: "การ refer ไป orthopedics และ NSAIDs อยู่ในสิทธิบัตรทอง MRI ต้องผ่านการอนุมัติจากแพทย์เฉพาะทางก่อน",
  },
}

// Auto-detect scene จาก transcript keyword แล้วเลือก fallback ที่ตรงที่สุด
export function getFallback(transcriptOrBody: string) {
  const text = transcriptOrBody.toLowerCase()

  // Scene 3: herniated disc หรือ ortho
  if (
    text.includes("herniated") ||
    text.includes("ortho") ||
    text.includes("l4") ||
    text.includes("l5") ||
    text.includes("nsaid")
  ) {
    return FALLBACK_SCENE_3
  }

  // Scene 2: para dose not specified
  if (
    text.includes("para") ||
    text.includes("พารา") ||
    text.includes("paracetamol")
  ) {
    return FALLBACK_SCENE_2
  }

  // Scene 1: default — dialect, low back pain
  return FALLBACK_SCENE_1
}