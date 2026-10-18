'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-muted hover:border-border-strong hover:text-text"
    >
      Sign out
    </button>
  );
}
