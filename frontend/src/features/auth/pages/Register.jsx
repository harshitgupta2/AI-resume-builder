import { useState } from "react";
import { Mail, Lock, Eye, EyeOff ,User} from "lucide-react";
import { Link,useNavigate,useLocation } from "react-router";
import Loader from "../components/Loader";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const[username , setuserName] = useState("");
  const [errors, setErrors] = useState({});

  const {laoding,handleRegister} = useAuth();
  const navigate  =useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/'

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

    try {
      await handleRegister({username,email,password})
      toast.success("User Registerd Successfully")
      navigate(from,{replace:true})
    
    } catch (error) {
    throw new Error("Registration failed",{cause:error})
    }
  };

  if(laoding){
    return <Loader />
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] flex items-center justify-center px-4 py-8">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-violet-700/30 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[140px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#312E81_0%,transparent_35%)]" />

      {/* Login Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl shadow-violet-900/20 p-6">
        {/* Logo & Header Container */}
        <div className="flex flex-col items-center mb-5">
          <h1 className="text-center text-2xl font-bold text-white">
            Welcome
          </h1>
          <p className="mt-1 text-center text-sm text-slate-400">
            Sign in to continue to your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/*Username */}
           <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Name
            </label>
            <div className="flex items-center rounded-lg border border-slate-700 bg-[#0F172A]/80 px-3.5 transition-all duration-300 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/30">
              <User className="text-slate-400 shrink-0" size={16} />
              <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setuserName(e.target.value)}
                className="w-full bg-transparent px-2.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>
          {/* Email */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Email
            </label>
            <div className="flex items-center rounded-lg border border-slate-700 bg-[#0F172A]/80 px-3.5 transition-all duration-300 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/30">
              <Mail className="text-slate-400 shrink-0" size={16} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent px-2.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Password
            </label>
            <div className="flex items-center rounded-lg border border-slate-700 bg-[#0F172A]/80 px-3.5 transition-all duration-300 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/30">
              <Lock className="text-slate-400 shrink-0" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent px-2.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Remember */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="accent-violet-600 rounded"
              />
              Remember me
            </label>
            <button
              type="button"
              className="text-violet-400 hover:text-violet-300"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="h-11 w-full rounded-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-violet-600/30 active:scale-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
           Sign In
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-xs text-slate-500">OR</span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>
        </form>

        {/* Footer */}
        <p className="mt-5 text-center text-xs text-slate-400">
          Already Have and Account?
          <Link to="/login" className="ml-1.5 cursor-pointer font-semibold text-violet-400 hover:text-violet-300">Login</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;