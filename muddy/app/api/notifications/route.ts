import { NextResponse } from 'next/server';

import { getNotificationsForCurrentUser } from '@/lib/notifications';

export async function GET() {
  const notifications = await getNotificationsForCurrentUser();

  return NextResponse.json(
    notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      source: notification.source,
      actorEmail: notification.actorEmail,
      createdAt: notification.createdAt.toISOString(),
      expiresAt: notification.expiresAt.toISOString(),
    })),
  );
}
