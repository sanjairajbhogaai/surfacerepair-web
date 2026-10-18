import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-content px-5 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-primary">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-text-muted">The link may be old, or the page may have moved.</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-primary px-5 py-3 text-white hover:bg-primary-hover"
      >
        Back to home
      </Link>
    </main>
  );
}
