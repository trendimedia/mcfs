// app/dashboard/applications/actions.ts
'use server';

import { db } from '@/lib/db';
import { applications } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';

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
  revalidatePath('/dashboard/applications');
}