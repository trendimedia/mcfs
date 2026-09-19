// app/dashboard/applications/actions.ts
'use server';

import { db } from '@/lib/db';
import { applications } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { notifyAdminsAndManagers } from '@/lib/notifications';

type JobApplicationData = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  city: string;
  location: string;
  position: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
};

export async function submitApplication(data: JobApplicationData) {
  await db.insert(applications).values(data);

  await notifyAdminsAndManagers({
    title: 'Job application submitted',
    message: `${data.firstName} ${data.lastName} applied for the ${data.position} position.`,
    type: 'form',
    source: 'applications',
    actorEmail: data.email,
  });

  revalidatePath('/dashboard/applications');
}