 
import 'server-only';

import { redirect } from 'next/navigation';

import { requireSession } from '@/lib/auth/session';

export type UserRole = 'employee' | 'manager' | 'hr' | 'admin';

export async function requireRole(
  allowedRoles: UserRole | UserRole[],
) {
  const session = await requireSession();

  const roles = Array.isArray(allowedRoles)
    ? allowedRoles
    : [allowedRoles];

  if (!roles.includes(session.user.role)) {
    redirect('/profile');
  }

  return session;
}

