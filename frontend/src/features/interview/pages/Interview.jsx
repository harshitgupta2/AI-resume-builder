import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Code2, MessageSquare, Navigation, ChevronDown, ArrowLeft } from "lucide-react";
import { useInterview } from "../hooks/useInterview";
import Loader from "../../auth/components/Loader";

/* ------------------------------------------------------------------
   Interview — the generated report view
   Layout: sections nav (left) · content (center) · score + gaps (right)
   Theme: slate-950 / slate-50, amber-300 brand accent.
   Semantic colors (emerald/amber/rose) are kept for score + severity.
------------------------------------------------------------------ */

const EYEBROW = "text-[10.5px] font-semibold uppercase tracking-[0.2em]";
const COUNT_BADGE =
  "rounded-full border border-slate-700 px-2.5 py-0.5 text-[11px] font-medium text-slate-400";

const SECTIONS = [
  { id: "technical", label: "Technical Questions", icon: Code2 },
  { id: "behavioral", label: "Behavioral Questions", icon: MessageSquare },
  { id: "roadmap", label: "Road Map", icon: Navigation },
];

const SEVERITY = {
  high: "border-rose-400/40 bg-rose-400/10 text-rose-300",
  medium: "border-amber-300/40 bg-amber-300/10 text-amber-200",
  low: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
};

const scoreTone = (score) =>
  score >= 75
    ? { ring: "#34d399", text: "text-emerald-300", label: "Strong match for this role" }
    : score >= 50
    ? { ring: "#fcd34d", text: "text-amber-300", label: "Moderate match for this role" }
    : { ring: "#fb7185", text: "text-rose-300", label: "Needs work for this role" };

const Interview = () => {
  const { interviewId } = useParams();
  const { report, getReportById,loading,getResumePdf } = useInterview();
  const [active, setActive] = useState("technical");
  const [loadingId, setLoadingId] = useState(interviewId);

  // Reset to "loading" the moment the target id changes — done during render
  // (React's pattern for adjusting state on prop change) rather than in the
  // effect, which avoids the synchronous-setState-in-effect warning.
  if (interviewId !== loadingId) {
    setLoadingId(interviewId);
  }

  useEffect(() => {
   getReportById(interviewId)
  }, [interviewId]);

  if (loading) {
    return <Loader message="Loading your report…" />;
  }

  if (status === "error" || !report) {
    return (
      <div className="font-body flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-950 px-6 text-center text-slate-50">
        <h1 className="font-display text-2xl">Report not found</h1>
        <p className="max-w-sm text-sm text-slate-400">
          This report doesn't exist or you don't have access to it. Try generating a
          new one from the home page.
        </p>
      </div>
    );
  }

  const technical = report.techinalQuestions ?? [];
  const behavioral = report.behaviouralQuestions ?? [];
  // The AI can return the plan out of order — sort by day so the timeline reads 1→N.
  const plan = [...(report.preparationPlan ?? [])].sort(
    (a, b) => (a.days ?? 0) - (b.days ?? 0)
  );
  const gaps = report.skillGaps ?? [];


  return (
    <div className="font-body min-h-screen bg-slate-950 text-slate-50">
      {/* Report header — the role this report targets */}
      <header className="mx-auto max-w-7xl border-b border-slate-800 px-6 py-8 sm:px-10">
        <Link
          to="/reports"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-amber-300"
        >
          <ArrowLeft size={15} />
          All reports
        </Link>
        <p className={`${EYEBROW} mb-2 text-amber-300`}>Interview report</p>
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
          {report.jobTitle || "Your target role"}
        </h1>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px lg:grid-cols-[220px_1fr_280px]">
        {/* ---------- Left: sections nav ---------- */}
        <aside className="flex flex-col border-slate-800 px-5 py-8 lg:border-r">
          <p className={`${EYEBROW} mb-5 px-3 text-slate-500`}>Sections</p>
          <nav className="flex flex-col gap-1">
            {SECTIONS.map(({ id, label, icon: Icon }) => {
              const on = active === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActive(id)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    on
                      ? "border border-amber-300/30 bg-amber-300/10 font-medium text-amber-300"
                      : "border border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  }`}
                >
                  <Icon size={16} className={on ? "text-amber-300" : "text-slate-500"} />
                  {label}
                </button>
              );
            })}
          </nav>
          <button
            type="button"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-amber-300 bg-amber-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 lg:mt-auto"
            onClick={()=>{getResumePdf(interviewId)}}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
            Download Resume</button>
        </aside>

        {/* ---------- Center: content ---------- */}
        <main className="min-w-0 px-6 py-8 sm:px-10">
          {active === "technical" && (
            <Section title="Technical Questions" count={`${technical.length} questions`}>
              <div className="space-y-4">
                {technical.map((q, i) => (
                  <QuestionCard key={i} index={i} q={q} />
                ))}
              </div>
            </Section>
          )}

          {active === "behavioral" && (
            <Section title="Behavioral Questions" count={`${behavioral.length} questions`}>
              <div className="space-y-4">
                {behavioral.map((q, i) => (
                  <QuestionCard key={i} index={i} q={q} />
                ))}
              </div>
            </Section>
          )}

          {active === "roadmap" && (
            <Section title="Preparation Road Map" count={`${plan.length}-day plan`}>
              <Timeline plan={plan} />
            </Section>
          )}
        </main>

        {/* ---------- Right: score + skill gaps ---------- */}
        <aside className="border-slate-800 px-6 py-8 lg:border-l">
          <p className={`${EYEBROW} mb-5 text-slate-500`}>Match score</p>
          <ScoreRing score={report.matchScore ?? 0} />

          <hr className="my-8 border-slate-800" />

          <p className={`${EYEBROW} mb-4 text-slate-500`}>Skill gaps</p>
          <div className="flex flex-col gap-2.5">
            {gaps.map((g, i) => (
              <div
                key={i}
                className={`rounded-lg border px-3.5 py-2.5 text-[13px] leading-snug ${
                  SEVERITY[g.severity] ?? SEVERITY.medium
                }`}
              >
                {g.skill}
              </div>
            ))}
            {gaps.length === 0 && (
              <p className="text-[13px] text-slate-500">No notable gaps found.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

/* ---------------- building blocks ---------------- */

const Section = ({ title, count, children }) => (
  <>
    <div className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-5">
      <h1 className="font-display text-2xl tracking-tight">{title}</h1>
      <span className={COUNT_BADGE}>{count}</span>
    </div>
    {children}
  </>
);

const QuestionCard = ({ index, q, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 transition-colors hover:border-slate-700">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <span className="shrink-0 rounded-md border border-amber-300/30 bg-amber-300/10 px-2 py-1 text-[11px] font-bold text-amber-300">
          Q{index + 1}
        </span>
        <span className="flex-1 font-medium leading-snug text-slate-100">
          {q.questions}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="space-y-5 border-t border-slate-800 px-5 py-5">
          <Labeled label="Intention" tone="border-indigo-400/40 bg-indigo-400/10 text-indigo-300">
            {q.intention}
          </Labeled>
          <Labeled label="Model answer" tone="border-emerald-400/40 bg-emerald-400/10 text-emerald-300">
            {q.answer}
          </Labeled>
        </div>
      )}
    </div>
  );
};

const Labeled = ({ label, tone, children }) => (
  <div>
    <span className={`${EYEBROW} inline-block rounded border px-2 py-1 ${tone}`}>
      {label}
    </span>
    <p className="mt-3 text-[14.5px] leading-relaxed text-slate-300">{children}</p>
  </div>
);

const Timeline = ({ plan }) => (
  <ol className="relative ml-2 border-l border-slate-800">
    {plan.map((step, i) => (
      <li key={step._id ?? i} className="relative pb-9 pl-8 last:pb-0">
        <span className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full border-2 border-amber-300 bg-slate-950" />
        <div className="mb-2 flex items-center gap-3">
          <span className="rounded-md border border-amber-300/30 bg-amber-300/10 px-2 py-0.5 text-[11px] font-bold text-amber-300">
            Day {i + 1}
          </span>
          <h3 className="font-display text-lg text-slate-100">{step.focus}</h3>
        </div>
        <ul className="space-y-1.5">
          {(step.tasks ?? []).map((t, j) => (
            <li key={j} className="flex gap-2.5 text-[14.5px] leading-relaxed text-slate-400">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-600" />
              {t}
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ol>
);

const ScoreRing = ({ score }) => {
  const tone = scoreTone(score);
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(100, Math.max(0, score)) / 100);
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={tone.ring}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-semibold tabular-nums text-slate-50">
            {score}
          </span>
          <span className="text-xs text-slate-500">%</span>
        </div>
      </div>
      <p className={`mt-4 text-center text-[13px] font-medium ${tone.text}`}>
        {tone.label}
      </p>
    </div>
  );
};

export default Interview;
