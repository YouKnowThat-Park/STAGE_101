import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.BACKEND_API_BASE;

export async function PATCH(req: NextRequest) {
  try {
    const payload = await req.json();
    const cookie = req.headers.get('cookie') ?? '';

    const res = await fetch(`${API_BASE}/users/me/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        cookie, // 🔥 인증 쿠키 전달
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
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const cookie = req.headers.get('cookie') ?? '';

    const res = await fetch(`${API_BASE}/users/me/profile-image`, {
      method: 'POST',
      headers: {
        cookie, // 🔥 인증 쿠키 전달
      },
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
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const cookie = req.headers.get('cookie') ?? '';

    const res = await fetch(`${API_BASE}/users/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        cookie, // 🔥 인증 쿠키 전달
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
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('delete user error:', err);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}
