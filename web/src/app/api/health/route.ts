import { NextResponse } from 'next/server';

export async function GET() {
  // DB, 외부 API 등 아무 것도 안 건드리고 바로 200 리턴
  return NextResponse.json({ ok: true });
}