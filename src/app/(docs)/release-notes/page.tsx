import { RELEASES, CHANGE_TYPE_LABEL, CHANGE_TYPE_COLORS } from "@/data/release-notes";

export default function ReleaseNotesPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="text-4xl font-bold text-text-primary mb-4">Release notes</h1>
      <p className="text-lg text-text-secondary leading-relaxed mb-10">
        A log of all notable changes to Atlas UI. Updated each release and published automatically when merged to main.
      </p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" aria-hidden="true" />

        <div className="space-y-12">
          {RELEASES.map((release) => (
            <section key={release.version} id={`v${release.version}`} className="relative pl-8 scroll-mt-20">
              {/* Timeline dot */}
              <div
                className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-blue-100 bg-surface"
                aria-hidden="true"
              />

              {/* Header */}
              <div className="flex items-baseline gap-3 mb-1">
                <h2 className="text-xl font-bold text-text-primary">v{release.version}</h2>
                <time
                  dateTime={release.date}
                  className="text-sm text-text-secondary"
                >
                  {new Date(release.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </time>
              </div>
              <p className="text-text-secondary leading-relaxed mb-4">{release.summary}</p>

              {/* Changes */}
              <ul className="space-y-2">
                {release.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className={`mt-0.5 shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${CHANGE_TYPE_COLORS[change.type]}`}
                    >
                      {CHANGE_TYPE_LABEL[change.type]}
                    </span>
                    <span className="text-sm text-text-primary leading-relaxed">{change.description}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {/* Page footer */}
      <div className="mt-12 pt-6 border-t border-border flex gap-6 text-sm text-text-secondary">
        <a href="#" className="hover:text-text-primary transition-colors">Edit this page</a>
        <a href="#" className="hover:text-text-primary transition-colors">Leave feedback</a>
      </div>
    </article>
  );
}
