import { NextRequest } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return new Response(JSON.stringify({ ok: true, path: params.path }), { status: 200 });
}
