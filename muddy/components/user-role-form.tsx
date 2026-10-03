// components/user-role-form.tsx
'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { updateUserRole } from '@/app/admin/actions';

type User = {
  id: string;
  email: string;
  role: string;
  employeeCode: string | null;
  updatedAt: Date | string;
};

export default function UserRoleForm({ user }: { user: User }) {
  const [state, formAction, isPending] = useActionState(updateUserRole, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-md border p-3 md:flex-row md:items-center md:justify-between"
    >
      <input type="hidden" name="userId" value={user.id} />

      <div>
        <p className="font-medium">{user.email}</p>
        <p className="text-sm text-muted-foreground">{user.employeeCode ?? 'No employee code'}</p>
        <p className="text-xs text-muted-foreground">
          Updated {new Date(user.updatedAt).toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <select
          name="role"
          defaultValue={user.role}
          className="rounded-md border bg-background px-3 py-2 text-sm"
          aria-label={`Role for ${user.email}`}
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="hr">HR</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
        >
          {isPending ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}