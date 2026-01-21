import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND = 'https://www.stage101.shop/api';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const token = cookies().get('__stage__')?.value;

  const res = await fetch(`${BACKEND}/cart-histories/`, {
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
