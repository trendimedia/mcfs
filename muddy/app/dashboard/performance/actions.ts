'use server';

import { revalidatePath } from 'next/cache';

import { getCurrentUser } from '@/lib/auth/current-user';
import { requireRole } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { performance } from '@/lib/db/schema';
import { notifyAdminsAndManagers } from '@/lib/notifications';

export async function submitPerformanceReview(formData: FormData) {
  await requireRole(['admin', 'manager']);

  const me = await getCurrentUser();
  if (!me) {
    throw new Error('You must be signed in to add a performance review.');
  }

  const employeeCode = String(formData.get('employeeCode') ?? '').trim();
  const month = String(formData.get('month') ?? '').trim();
  const scoreValue = Number(formData.get('scorePercent') ?? 0);
  const notes = String(formData.get('notes') ?? '').trim();

  if (!employeeCode || !month || !Number.isFinite(scoreValue)) {
    throw new Error('Employee, month, and score are required.');
  }

  const scorePercent = Math.min(Math.max(scoreValue, 0), 100);

  const reviewerName = me.employeeCode ? `${me.employeeCode} (${me.email})` : me.email;

  await db.insert(performance).values({
    employeeCode,
    month,
    scorePercent: scorePercent.toString(),
    notes: notes || 'No notes added',
    reviewedBy: reviewerName,
  });

  await notifyAdminsAndManagers({
    title: 'Performance review submitted',
    message: `${reviewerName} reviewed ${employeeCode} for ${month}.`,
    type: 'form',
    source: 'performance',
    actorEmail: me.email,
  });

  revalidatePath('/dashboard/performance');
}
