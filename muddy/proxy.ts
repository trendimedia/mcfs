// middleware.ts  (or proxy.ts if you're on Next.js 16)
import { auth } from '@/lib/auth/server';

export default auth.middleware({
  loginUrl: '/dashboard', // wherever your login-form1 page lives
});

export const config = {
  matcher: ['/dashboard/:path*'],
};