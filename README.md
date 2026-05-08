# Thai Clinical Copilot — 30-Baht Edition

> คืนเวลาให้หมอไทย เพิ่มคุณภาพการรักษาสิทธิบัตรทอง

## Setup

```bash
cp .env.local.example .env.local
# ใส่ OPENAI_API_KEY ใน .env.local

npm install
npm run dev
```

## Team Roles

| คน | หน้าที่ | Files |
|---|---|---|
| คนที่ 1 | AI Pipeline | `app/api/`, `lib/prompts.ts` |
| คนที่ 2 | Frontend UI | `app/page.tsx`, `app/review/`, `components/` |
| คนที่ 3 | Prompt + Demo | `lib/prompts.ts`, `demo/` |

## Demo Scenarios

ดู `demo/script.md`

## Tech Stack

- Next.js 14 + Tailwind CSS
- OpenAI Whisper (transcription)
- GPT-4o (SOAP generation)
- Deployed on Vercel
