import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

async function fetchWithRefresh(req: NextRequest, url: string, init: RequestInit) {
  const cookie = req.headers.get('cookie') ?? '';
  const headers = {
    ...((init.headers as Record<string, string>) ?? {}),
    cookie,
  };

  let res = await fetch(url, {
    ...init,
    headers,
  });

  if (res.status !== 401) {
    return { res, refreshCookie: null };
  }

  const refreshRes = await fetch(`${API_BASE}/users/refresh-token`, {
    method: 'POST',
    headers: { cookie },
  });

  const refreshCookie = refreshRes.headers.get('set-cookie');
  if (!refreshRes.ok) {
    return { res, refreshCookie: null };
  }

  res = await fetch(url, {
    ...init,
    headers,
  });
  return { res, refreshCookie };
}

export async function PATCH(req: NextRequest) {
  try {
    const payload = await req.json();
    const { res, refreshCookie } = await fetchWithRefresh(req, `${API_BASE}/users/me/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let message = '프로필 업데이트 실패';
      try {
        const err = await res.json();
        message = err?.detail || message;
      } catch {}

      return NextResponse.json({ message }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: refreshCookie ? { 'set-cookie': refreshCookie } : undefined,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const { res, refreshCookie } = await fetchWithRefresh(req, `${API_BASE}/users/me/profile-image`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return NextResponse.json(
        { message: '프로필 이미지 업로드 실패', detail: text },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: refreshCookie ? { 'set-cookie': refreshCookie } : undefined,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    const { res, refreshCookie } = await fetchWithRefresh(req, `${API_BASE}/users/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      let message = '회원 탈퇴 실패';
      try {
        const err = await res.json();
        message = err?.detail || message;
      } catch {}

      return NextResponse.json({ message }, { status: res.status });
    }

    // 백엔드가 204 No Content를 주는 구조라면
    return NextResponse.json({ success: true }, {
      headers: refreshCookie ? { 'set-cookie': refreshCookie } : undefined,
    });
  } catch (err) {
    console.error('delete user error:', err);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}
