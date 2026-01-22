import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${API_BASE}/reviews/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: req.headers.get('cookie') ?? '',
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    if (!res.ok) {
      return NextResponse.json({ message: text || '백엔드 에러' }, { status: res.status });
    }

    return NextResponse.json(JSON.parse(text));
  } catch (err) {
    console.error('🔥 BFF ERROR:', err);
    return NextResponse.json({ message: 'BFF 내부 에러 (콘솔 확인)' }, { status: 500 });
  }
}
