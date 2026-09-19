'use server';

import 'server-only';

import { and, desc, eq, gt } from 'drizzle-orm';

import { getCurrentUser } from '@/lib/auth/current-user';
import { db } from '@/lib/db';
import { notifications } from '@/lib/db/schema';

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export type NotificationType = 'login' | 'form' | 'system';

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  source: string | null;
  actorEmail: string | null;
  createdAt: Date;
  expiresAt: Date;
};

export async function notifyAdminsAndManagers({
  title,
  message,
  type = 'form',
  source = 'system',
  actorEmail,
}: {
  title: string;
  message: string;
  type?: NotificationType;
  source?: string | null;
  actorEmail?: string | null;
}) {
  try {
    const expiry = new Date(Date.now() + THREE_DAYS_MS);

    await db.insert(notifications).values([
      {
        title,
        message,
        type,
        source,
        actorEmail: actorEmail ?? null,
        recipientRole: 'admin',
        expiresAt: expiry,
      },
      {
        title,
        message,
        type,
        source,
        actorEmail: actorEmail ?? null,
        recipientRole: 'manager',
        expiresAt: expiry,
      },
    ]);
  } catch (error) {
    console.error('Failed to insert notifications:', error);
  }
}

export async function ensureWelcomeNotificationForRole(role: 'admin' | 'manager') {
  const cutoff = new Date(Date.now() - THREE_DAYS_MS);

  try {
    const existing = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.recipientRole, role),
          eq(notifications.source, 'welcome'),
          gt(notifications.createdAt, cutoff),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      return;
    }

    await db.insert(notifications).values({
      title: 'Welcome',
      message: 'Hello everyone! Welcome to the MCFS platform.',
      type: 'system',
      source: 'welcome',
      actorEmail: 'system@mcfs.local',
      recipientRole: role,
      expiresAt: new Date(Date.now() + THREE_DAYS_MS),
    });
  } catch (error) {
    console.error('Failed to insert welcome notification:', error);
  }
}

export async function getNotificationsForCurrentUser(): Promise<NotificationItem[]> {
  const me = await getCurrentUser();

  if (!me || !['admin', 'manager'].includes(me.role)) {
    return [];
  }

  try {
    const rows = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.recipientRole, me.role === 'admin' ? 'admin' : 'manager'),
          gt(notifications.expiresAt, new Date()),
        ),
      )
      .orderBy(desc(notifications.createdAt))
      .limit(30);

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      message: row.message,
      type: row.type,
      source: row.source,
      actorEmail: row.actorEmail,
      createdAt: row.createdAt,
      expiresAt: row.expiresAt,
    }));
  } catch (error) {
    console.error('Failed to load notifications:', error);
    return [];
  }
}
