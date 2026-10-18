export default function Home() {
  const colours = [
    ['Primary', 'bg-primary'],
    ['WhatsApp', 'bg-whatsapp'],
    ['Success', 'bg-success'],
    ['Warning', 'bg-warning'],
    ['Danger', 'bg-danger'],
    ['Info', 'bg-info'],
    ['Accent', 'bg-accent'],
    ['Surface alt', 'bg-surface-alt'],
  ];

  return (
    <main className="mx-auto max-w-content px-5 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-primary">
        Phase 0 — Design tokens preview
      </p>
      <h1 className="mt-3 font-display text-5xl font-bold tracking-tight text-text">
        SurfaceRepair.in
      </h1>
      <p className="mt-4 max-w-prose text-lg text-text-muted">
        This is a temporary page to confirm the design system is wired up correctly.
        It is replaced in Phase 3 with the real homepage.
      </p>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-text">Colours</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {colours.map(([label, cls]) => (
            <div key={label} className={`${cls} rounded-md p-4 text-sm text-white`}>
              {label}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-text">Type scale</h2>
        <div className="mt-4 space-y-2">
          <p className="font-display text-5xl font-bold">Hero 56</p>
          <p className="font-display text-4xl font-bold">H1 44</p>
          <p className="font-display text-3xl font-semibold">H2 34</p>
          <p className="font-display text-2xl font-semibold">H3 28</p>
          <p className="font-display text-xl font-semibold">H4 22</p>
          <p className="text-lg">Lead paragraph 18 — warm off-white background.</p>
          <p className="text-base">Body 16 — the default reading size.</p>
          <p className="text-sm text-text-muted">Small 14 — form labels and secondary text.</p>
          <p className="font-mono text-xs uppercase tracking-wider">
            Mono 12 — SR-2026-0042 RECEIVED
          </p>
        </div>
      </section>

      <p className="mt-12 text-sm text-text-subtle">
        If you can read this and the colours above render, Phase 0 succeeded.
      </p>
    </main>
  );
}
