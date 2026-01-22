import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const token = cookies().get('__stage__')?.value;

  const res = await fetch(`${API_BASE}/cart-histories/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { cookie: `__stage__=${token}` } : {}),
    },
    body,
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET() {
  const cookie = cookies().toString();

  const res = await fetch(`${API_BASE}/cart-histories/me`, {
    method: 'GET',
    headers: {
      cookie,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return NextResponse.json({ message: text || '거래 내역 조회 실패' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
