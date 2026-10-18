'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signIn('nodemailer', { email, redirect: false, callbackUrl: '/admin' });
      if (result?.error) {
        setError('Could not send magic link. Try again.');
      } else {
        setSent(true);
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
        <div className="rounded-md border border-border bg-surface p-8">
          <h1 className="font-display text-2xl font-semibold">Check your email</h1>
          <p className="mt-3 text-sm text-text-muted">
            If <strong>{email}</strong> is a registered admin email, a sign-in link is on its way. It expires in 10 minutes.
          </p>
          <p className="mt-3 text-xs text-text-subtle">
            (In development, the link appears in your terminal, not your inbox.)
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <div className="rounded-md border border-border bg-surface p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Admin</p>
        <h1 className="mt-2 font-display text-2xl font-semibold">Sign in to SurfaceRepair.in</h1>
        <p className="mt-2 text-sm text-text-muted">Enter your work email. We&apos;ll send you a sign-in link — no password needed.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-sm border border-border bg-surface px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="admin@surfacerepair.in"
              disabled={loading}
            />
          </div>
          {error && <p className="rounded-sm bg-red-50 px-3 py-2 text-sm text-danger">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Send magic link'}
          </button>
        </form>
      </div>
    </main>
  );
}
