import { useState, useRef, useCallback, useEffect, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import {
  Briefcase,
  User,
  UploadCloud,
  FileText,
  Star,
  Info,
  X,
  ChevronRight,
} from "lucide-react";
import { useInterview } from "../hooks/useInterview";
import { getAllInterviewReports } from "../services/api";
import { AuthContext } from "../../auth/context/AuthContext";

const MAX_BYTES = 3 * 1024 * 1024;
const MAX_CHARS = 5000;
const PENDING_KEY = "pendingReport";

const EYEBROW = "text-[10.5px] font-semibold uppercase tracking-[0.2em]";
const BADGE =
  "rounded-full border border-amber-300/40 bg-amber-300/10 px-2.5 py-0.5 text-amber-300";
const INPUT =
  "w-full resize-none rounded-xl border border-slate-800 bg-slate-900 px-4 py-3.5 text-[15px] leading-relaxed text-slate-50 placeholder:text-slate-600 transition-colors hover:border-slate-700 focus:border-amber-300 focus:outline-none";

const formatSize = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const formatDate = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return "";
  }
};

const Home = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [fileError, setFileError] = useState("");
  const [formError, setFormError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [recent, setRecent] = useState([]);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { generateReport, loading } = useInterview();
  // authLoading keeps a signed-in user from being bounced to /login during the
  // moment after a hard refresh when the session hasn't been verified yet.
  const { user, loading: authLoading } = useContext(AuthContext);

  /* Restore the draft stashed before the login redirect. */
  useEffect(() => {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return;
    sessionStorage.removeItem(PENDING_KEY);
    try {
      const data = JSON.parse(raw);
      setJobDescription(data.jobDescription ?? "");
      setSelfDescription(data.selfDescription ?? "");
    } catch {
      // Corrupt entry — nothing to restore.
    }
  }, []);

  /* Recent reports — only meaningful once we know who the user is. */
  useEffect(() => {
    if (!user) {
      setRecent([]);
      return;
    }
    let alive = true;
    getAllInterviewReports()
      .then((res) => {
        if (alive) setRecent((res?.data ?? []).slice(0, 6));
      })
      .catch(() => {
        // 404 "No interview reports found" — the user has none yet.
        if (alive) setRecent([]);
      });
    return () => {
      alive = false;
    };
  }, [user]);

  const acceptFile = useCallback((next) => {
    if (!next) return;
    if (next.type !== "application/pdf") {
      setFile(null);
      setFileError(
        "That file isn't a PDF. Export your resume as PDF and try again.",
      );
      return;
    }
    if (next.size > MAX_BYTES) {
      setFile(null);
      setFileError(`That file is ${formatSize(next.size)}. The limit is 3 MB.`);
      return;
    }
    setFileError("");
    setFile(next);
  }, []);

  const removeFile = () => {
    setFile(null);
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const hasResume = Boolean(file);
  const hasRole = jobDescription.trim().length > 0;
  const canSubmit = hasResume && hasRole && !loading && !authLoading;
  const needsResumeAgain = !file && jobDescription.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setFormError("");

    if (!user) {
      sessionStorage.setItem(
        PENDING_KEY,
        JSON.stringify({ jobDescription, selfDescription }),
      );
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }

    try {
      const created = await generateReport({
        resumeFile: file,
        jobDescription: jobDescription.trim(),
        selfDescription: selfDescription.trim(),
      });
      if (created?._id) {
        navigate(`/interview/${created._id}`);
      } else {
        setFormError("The report couldn't be generated. Please try again.");
      }
    } catch (err) {
      setFormError(
        err.message ||
          "Couldn't reach the server. Check your connection and try again.",
      );
    }
  };

  return (
    <div className="font-body min-h-screen bg-slate-950 px-4 py-12 text-slate-50 sm:px-6">
      {/* Top bar */}
      <nav className="mx-auto mb-10 flex max-w-5xl items-center justify-between">
        <span className="font-display text-lg tracking-wide">
          Interview <em className="not-italic text-amber-300">Report</em>
        </span>
        <Link
          to="/reports"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-amber-300"
        >
          Your reports
          <ChevronRight size={15} />
        </Link>
      </nav>

      {/* Header */}
      <header className="mx-auto mb-10 max-w-2xl text-center">
        <p className={`${EYEBROW} mb-4 text-amber-300`}>New report</p>
        <h1 className="font-display text-4xl font-light leading-[1.08] tracking-tight sm:text-5xl">
          Create your custom{" "}
          <em className="italic text-amber-300">interview plan.</em>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-slate-400">
          Let our AI analyze the job requirements and your unique profile to
          build a winning strategy.
        </p>
      </header>

      {/* Card */}
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left — Target Job Description */}
          <section className="border-b border-slate-800 p-7 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-2.5 font-display text-xl">
                <Briefcase className="text-amber-300" size={18} />
                Target Job Description
              </h2>
              <span className={`${EYEBROW} ${BADGE}`}>Required</span>
            </div>

            <div className="relative">
              <textarea
                rows={16}
                maxLength={MAX_CHARS}
                className={`${INPUT} pb-9`}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder={
                  "Paste the full job description here…\n\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design…'"
                }
              />
              <span className="pointer-events-none absolute bottom-3 right-4 text-xs tabular-nums text-slate-600">
                {jobDescription.length} / {MAX_CHARS} chars
              </span>
            </div>
          </section>

          {/* Right — Your Profile */}
          <section className="p-7 sm:p-8">
            <h2 className="mb-5 flex items-center gap-2.5 font-display text-xl">
              <User className="text-amber-300" size={18} />
              Your Profile
            </h2>

            {/* Upload Resume */}
            <div className="mb-2 flex items-center gap-3">
              <span className={`${EYEBROW} text-slate-500`}>Upload resume</span>
              <span className={`${EYEBROW} ${BADGE}`}>Best results</span>
            </div>

            {file ? (
              <div className="flex items-center gap-4 rounded-xl border border-amber-300 bg-slate-900 px-5 py-4">
                <FileText className="shrink-0 text-amber-300" size={20} />
                <div className="min-w-0 flex-1">
                  <span className="block truncate font-medium">
                    {file.name}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-slate-400">
                    {formatSize(file.size)} · Attached
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  aria-label="Remove file"
                  className="shrink-0 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-rose-300"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  acceptFile(e.dataTransfer.files?.[0]);
                }}
                className={`flex w-full flex-col items-center gap-2 rounded-xl border border-dashed bg-slate-900 px-6 py-8 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                  dragging
                    ? "border-amber-300"
                    : "border-slate-700 hover:border-amber-300"
                }`}
              >
                <UploadCloud className="text-amber-300" size={26} />
                <span className="font-medium text-slate-50">
                  Click to upload or drag &amp; drop
                </span>
                <span className={`${EYEBROW} text-slate-500`}>
                  PDF · Max 3MB
                </span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => acceptFile(e.target.files?.[0])}
            />
            {fileError && (
              <p className="mt-2 text-[13px] text-rose-300">{fileError}</p>
            )}
            {!fileError && needsResumeAgain && (
              <p className="mt-2 text-[13px] text-slate-400">
                Attach your resume again to continue.
              </p>
            )}

            {/* OR divider */}
            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-800" />
              <span className={`${EYEBROW} text-slate-500`}>Or</span>
              <span className="h-px flex-1 bg-slate-800" />
            </div>

            {/* Self-description */}
            <div className="mb-2 flex items-center gap-3">
              <span className={`${EYEBROW} text-slate-500`}>
                Quick self-description
              </span>
              <span className={`${EYEBROW} text-slate-600`}>Optional</span>
            </div>
            <textarea
              rows={4}
              maxLength={MAX_CHARS}
              className={INPUT}
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              placeholder="Say what your resume can't — what you want next, why this role in particular…"
            />

            {/* Info callout */}
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3">
              <Info className="mt-0.5 shrink-0 text-amber-300" size={16} />
              <p className="text-[13px] leading-relaxed text-slate-400">
                A <b className="font-semibold text-slate-200">resume (PDF)</b>{" "}
                and the{" "}
                <b className="font-semibold text-slate-200">job description</b>{" "}
                are required to generate a personalized plan.
              </p>
            </div>
          </section>
        </div>

        {/* Footer — prominent CTA */}
        <div className="flex flex-col items-end gap-2 border-t border-slate-800 bg-slate-900/60 px-7 py-5 sm:px-8">
          {formError && (
            <span className="text-[13px] text-rose-300">{formError}</span>
          )}
          {!authLoading && !user && canSubmit && (
            <span className="text-[13px] text-slate-400">
              You'll sign in first. Your job description is kept.
            </span>
          )}

          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className={`inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
              canSubmit
                ? "cursor-pointer border-amber-300 bg-amber-300 text-slate-950 shadow-lg shadow-amber-300/20 hover:opacity-90"
                : "cursor-not-allowed border-slate-800 bg-transparent text-slate-600"
            }`}
          >
            <Star size={16} className={canSubmit ? "fill-slate-950" : ""} />
            {loading ? "Generating…" : "Generate my interview plan"}
          </button>
        </div>
      </div>

      {/* Recent reports */}
      <section className="mx-auto mt-16 max-w-5xl">
        <h2 className="font-display mb-6 text-2xl tracking-tight sm:text-3xl">
          My Recent Interview Plans
        </h2>

        {recent.length === 0 ? (
          <p className="text-sm text-slate-500">
            No reports yet — generate your first one above.
          </p>
        ) : (
          <div className="scrollbar-elegant flex snap-x gap-4 overflow-x-auto pb-3">
            {recent.map((r) => (
              <button
                key={r._id}
                type="button"
                onClick={() => navigate(`/interview/${r._id}`)}
                className="w-[280px] shrink-0 snap-start rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-left transition-colors hover:border-amber-300"
              >
                <h3 className="font-display text-lg leading-snug text-slate-100">
                  {r.jobTitle || "Untitled role"}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Generated on {formatDate(r.createdAt)}
                </p>
                {typeof r.matchScore === "number" && (
                  <p className="mt-1 text-sm font-semibold text-amber-300">
                    Match Score: {r.matchScore}%
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
