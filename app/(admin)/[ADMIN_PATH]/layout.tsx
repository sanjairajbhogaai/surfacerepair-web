import type { ReactNode } from 'react';
import { requireStaff } from '@/lib/auth/session';
import { SignOutButton } from '@/components/sign-out-button';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireStaff();

  return (
    <div className="min-h-screen bg-surface-alt">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-content items-center justify-between px-5 py-4">
          <p className="font-display text-lg font-semibold">SurfaceRepair Admin</p>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-text-muted">{user.email}</span>
            <span className="rounded-full bg-primary-subtle px-2 py-0.5 text-xs font-medium text-primary">
              {user.role}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-content px-5 py-8">{children}</main>
    </div>
  );
}
