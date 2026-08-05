
const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#020617] px-4 text-white">
      {/* Background Glows (Matching your page theme) */}
      <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-violet-700/20 blur-[100px]" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/15 blur-[120px]" />

      {/* Main Loader Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-2xl shadow-violet-900/20">
        
        {/* Glowing Dual Spinner */}
        <div className="relative flex items-center justify-center">
          {/* Outer Ring */}
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-violet-500 border-r-indigo-500 [animation-duration:1.2s]" />
          
          {/* Inner Reverse Ring */}
          <div className="absolute h-10 w-10 animate-spin rounded-full border-4 border-transparent border-t-cyan-400 border-l-cyan-400 [animation-direction:reverse] [animation-duration:0.8s]" />
          
          {/* Glowing Center Pulse */}
          <div className="absolute h-3 w-3 rounded-full bg-violet-400 shadow-[0_0_12px_#8b5cf6] animate-pulse" />
        </div>

        {/* Text with subtle fade animation */}
        <div className="flex flex-col items-center gap-1">
          <p className="animate-pulse text-sm font-medium tracking-wide text-slate-200">
            {message}
          </p>
          <span className="text-xs text-slate-400">Please wait a moment</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;