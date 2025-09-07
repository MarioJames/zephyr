import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const returnedState = url.searchParams.get('state') || '';
  const cookieState = req.cookies.get('logout_state')?.value || '';

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || '/';

  let location = `${appUrl}/logged-out`;
  if (!cookieState || returnedState !== cookieState) {
    // State mismatch: do not proceed to local signOut automatically
    const u = new URL(`${appUrl}/logged-out`);
    u.searchParams.set('error', 'state_mismatch');
    location = u.toString();
  }

  const res = NextResponse.redirect(location);
  // Clear the state cookie regardless
  res.cookies.set({
    name: 'logout_state',
    value: '',
    expires: new Date(0),
    path: '/',
  });
  return res;
}

