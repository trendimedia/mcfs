import 'server-only';

import { getCurrentSession } from '@/lib/auth/session';

export async function getCurrentUser() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  return session.user;
}