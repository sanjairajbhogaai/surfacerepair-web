'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-content px-5 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold">Something went wrong</h1>
      <p className="mt-3 text-text-muted">Please try again, or contact us on WhatsApp.</p>
      <button
        onClick={reset}
        className="mt-6 rounded-md bg-primary px-5 py-3 text-white hover:bg-primary-hover"
      >
        Try again
      </button>
    </main>
  );
}
