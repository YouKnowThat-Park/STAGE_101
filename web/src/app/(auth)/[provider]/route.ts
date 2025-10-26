import { socialLogin } from '../sign-in/kakao/actions';

export async function POST(
  request: Request,
  { params }: { params: { provider: 'kakao' | 'google' } },
) {
  await socialLogin(params.provider);
}
