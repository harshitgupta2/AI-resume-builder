import { useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { FileText, Plus, ChevronRight, Calendar } from "lucide-react";
import { useInterview } from "../hooks/useInterview";
import Loader from "../../auth/components/Loader";

/* ------------------------------------------------------------------
   Reports — list of every report the user has generated
   Source: GET /api/interview/reports/all
   Theme: slate-950 / slate-50, amber-300 accent.
------------------------------------------------------------------ */

const EYEBROW = "text-[10.5px] font-semibold uppercase tracking-[0.2em]";
const PILL =
  "inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-300 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-opacity hover:opacity-90";

const formatDate = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

const Reports = () => {
  const navigate = useNavigate();
  const { allReports, getAllReport, loading } = useInterview();

  useEffect(() => {
    getAllReport();
  }, []);

  if (loading) {
    return <Loader message="Loading your reports…" />;
  }

  const hasReports = Array.isArray(allReports) && allReports.length > 0;

  return (
    <div className="font-body min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-10">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={`${EYEBROW} mb-2 text-amber-300`}>Your reports</p>
            <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
              Interview reports
            </h1>
          </div>
          <Link to="/" className={PILL}>
            <Plus size={16} className="fill-slate-950" />
            New report
          </Link>
        </div>

        {/* Empty State */}
        {!hasReports && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-16 text-center">
            <FileText className="text-slate-600" size={32} />
            <div>
              <h2 className="font-display text-xl">No reports yet</h2>
              <p className="mx-auto mt-1 max-w-xs text-sm text-slate-400">
                Generate your first interview report and it'll show up here.
              </p>
            </div>
            <button type="button" onClick={() => navigate("/")} className={PILL}>
              <Plus size={16} className="fill-slate-950" />
              Create your first report
            </button>
          </div>
        )}

        {/* List State */}
        {hasReports && (
          <ul className="space-y-3">
            {allReports.map((r) => (
              <li key={r._id}>
                <button
                  type="button"
                  onClick={() => navigate(`/interview/${r._id}`)}
                  className="flex w-full items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-4 text-left transition-colors hover:border-amber-300"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-300/30 bg-amber-300/10">
                    <FileText className="text-amber-300" size={18} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <span className="block truncate font-display text-lg text-slate-100">
                      {r.jobTitle || "Untitled role"}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[13px] text-slate-500">
                      <Calendar size={13} />
                      {formatDate(r.createdAt)}
                    </span>
                  </div>

                  <ChevronRight className="shrink-0 text-slate-600" size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Reports;