/* ------------------------------------------------------------------
   Loader — matches the interview Home theme
   slate-950 surface, amber-300 accent, editorial type
------------------------------------------------------------------ */

const EYEBROW = "text-[10.5px] font-semibold uppercase tracking-[0.2em]";

const Loader = ({ message = "Loading…" }) => {
  return (
    <div className="font-body relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 text-slate-50">
      {/* subtle amber wash */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-300/10 blur-[130px]" />

      <div className="relative z-10 flex flex-col items-center gap-7 rounded-2xl border border-slate-800 bg-slate-900/60 px-10 py-9 backdrop-blur-sm">
        {/* Dual ring spinner */}
        <div className="relative flex items-center justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-2 border-slate-800 border-t-amber-300 [animation-duration:1.1s]" />
          <div className="absolute h-8 w-8 animate-spin rounded-full border-2 border-transparent border-b-amber-300/60 [animation-direction:reverse] [animation-duration:0.8s]" />
          <div className="absolute h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_12px_theme(colors.amber.300)]" />
        </div>

        <div className="flex flex-col items-center gap-1.5 text-center">
          <p className="font-display text-lg italic text-slate-50">{message}</p>
          <span className={`${EYEBROW} text-slate-500`}>Please wait a moment</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
