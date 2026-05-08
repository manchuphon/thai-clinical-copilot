import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { SYSTEM_PROMPT } from "@/lib/prompts"
import { FALLBACK_RESPONSE } from "@/lib/fallback"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json()
    if (!transcript) return NextResponse.json({ error: "No transcript" }, { status: 400 })

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Transcript:\n${transcript}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    })

    const raw = completion.choices[0].message.content || "{}"
    const result = JSON.parse(raw)
    return NextResponse.json(result)
  } catch (e: any) {
    // Hardcoded fallback — demo must never crash
    return NextResponse.json(FALLBACK_RESPONSE)
  }
}
