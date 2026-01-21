import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE = process.env.BACKEND_API_BASE || 'http://localhost:8000';

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
