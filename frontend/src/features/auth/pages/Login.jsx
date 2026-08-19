import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

/* ------------------------------------------------------------------
   Login — matches the interview Home theme
   slate-950 / slate-50 surface, amber-300 accent, editorial type
------------------------------------------------------------------ */

const EYEBROW = "text-[10.5px] font-semibold uppercase tracking-[0.2em]";
const FIELD =
  "flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 transition-colors hover:border-slate-700 focus-within:border-amber-300";
const INPUT =
  "w-full bg-transparent py-3.5 text-[15px] text-slate-50 placeholder:text-slate-600 outline-none";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const location = useLocation();

  const { user, loading, handleLogin } = useAuth();

  const [errors, setErrors] = useState({});
  const from = location.state?.from?.pathname || "/";

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

      const loggedUser = await handleLogin({ email, password });
      if (loggedUser.success) {
        toast.success("Logged in successfully");
        // Redirect is handled declaratively by the <Navigate> guard below,
        // once the `user` state has actually committed — no race.
      } else {
        toast.error(loggedUser.message);
      }
    
  };

  // Once authenticated, leave the login page for the intended destination.
  if (user) {
    return <Navigate to={from} replace />;
  }

  if (loading) {
    return <Loader message="Signing you in…" />;
  }

  return (
    <main className="font-body relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-12 text-slate-50">
      {/* soft amber wash to echo the accent, kept subtle */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-300/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-300/5 blur-[120px]" />

      <div className="relative w-full max-w-md">
        {/* Wordmark */}
        <div className="mb-8 flex items-center justify-between">
          <span className="font-display text-xl tracking-wide">
            Interview <em className="not-italic text-amber-300">Report</em>
          </span>
          <span className={`${EYEBROW} text-slate-500`}>Sign in</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-sm">
          <p className={`${EYEBROW} mb-4 text-amber-300`}>Welcome back</p>

          <h1 className="font-display mb-2 text-4xl font-light leading-[1.08] tracking-tight">
            Pick up
            <br />
            <em className="italic text-amber-300">where you left off.</em>
          </h1>

          <p className="mb-8 max-w-sm text-sm text-slate-400">
            Sign in to generate reports and revisit the questions you're
            preparing for.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label className={`${EYEBROW} mb-2 block text-slate-500`}>
                Email
              </label>
              <div className={FIELD}>
                <Mail className="shrink-0 text-slate-500" size={16} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={INPUT}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-[13px] text-rose-300">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className={`${EYEBROW} mb-2 block text-slate-500`}>
                Password
              </label>
              <div className={FIELD}>
                <Lock className="shrink-0 text-slate-500" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={INPUT}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="shrink-0 text-slate-500 transition-colors hover:text-amber-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-[13px] text-rose-300">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-[13px]">
              <label className="flex cursor-pointer items-center gap-2 text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-3.5 w-3.5 rounded accent-amber-300"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-slate-400 underline underline-offset-4 transition-colors hover:text-amber-300"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full border border-amber-300 bg-amber-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-[13px] text-slate-500">
          Don't have an account?
          <Link
            to="/register"
            className="ml-1.5 font-semibold text-amber-300 underline underline-offset-4 hover:opacity-90"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
