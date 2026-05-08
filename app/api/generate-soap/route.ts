import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { SYSTEM_PROMPT } from "@/lib/prompts"
import { getFallback } from "@/lib/fallback"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  // เก็บ transcript ไว้ก่อน เพื่อใช้ใน catch block ด้วย
  let transcript = ""

  try {
    const body = await req.json()
    transcript = body.transcript || ""

    if (!transcript) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Transcript:\n\n${transcript}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    })

    const raw = completion.choices[0].message.content || "{}"
    const result = JSON.parse(raw)

    // Safety defaults — ป้องกัน frontend crash ถ้า GPT-4o ตอบไม่ครบ
    return NextResponse.json({
      subjective: result.subjective || "[NOT SPECIFIED]",
      objective:  result.objective  || "[NOT SPECIFIED]",
      assessment: result.assessment || "[NEEDS REVIEW]",
      plan:       result.plan       || "[NOT SPECIFIED]",
      icd10:      Array.isArray(result.icd10) ? result.icd10 : [],
      nhso:       result.nhso       || { covered: false, note: "ไม่สามารถตรวจสอบสิทธิ์ได้" },
    })

  } catch (error: any) {
    console.error("Generate SOAP error:", error?.message)

    // ส่ง transcript ที่เก็บไว้ตอนต้น เข้า getFallback โดยตรง
    return NextResponse.json(getFallback(transcript))
  }
}