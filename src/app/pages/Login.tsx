import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router";
import { ApiError } from "../../utils/httpUtils";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => name.trim().length > 0 && password.trim().length > 0 && !isSubmitting,
    [name, password, isSubmitting]
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);

      await login({ name: name.trim(), password: password.trim() });
      navigate("/", { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setError("Incorrect username or password.");
        } else {
          setError(`Error ${error.status}: ${error.message || "Could not sign in."}`);
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-deep flex h-screen w-screen items-center justify-center px-[24px] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#928dd3]/8 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-[300px] h-[300px] bg-[#928dd3]/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="bg-[#0a0a0f]/90 border border-white/[0.08] relative w-full max-w-[480px] rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-[#928dd3]/5 via-transparent to-transparent" />
        <div className="content-stretch flex flex-col gap-[20px] p-[28px] relative">
          <div className="flex flex-col gap-[6px]">
            <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] text-[34px] tracking-[-0.34px] text-white">
              Login
            </p>
            <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[15px] text-white/50" style={{ fontVariationSettings: "'wdth' 100" }}>
              Sign in to open your dashboard.
            </p>
          </div>

          <form className="flex flex-col gap-[14px]" onSubmit={onSubmit}>
            <label className="flex flex-col gap-[8px]" htmlFor="login-name">
              <span className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white/80" style={{ fontVariationSettings: "'wdth' 100" }}>
                Username
              </span>
              <input
                id="login-name"
                type="text"
                autoComplete="username"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your username"
                className="h-[48px] rounded-[12px] border border-white/[0.08] bg-white/[0.02] px-[16px] text-white placeholder-white/25 outline-none focus:border-[#928dd3] focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(146,141,211,0.15)] transition-all duration-300"
              />
            </label>

            <label className="flex flex-col gap-[8px]" htmlFor="login-password">
              <span className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white/80" style={{ fontVariationSettings: "'wdth' 100" }}>
                Password
              </span>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="h-[48px] w-full rounded-[12px] border border-white/[0.08] bg-white/[0.02] px-[16px] pr-[90px] text-white placeholder-white/25 outline-none focus:border-[#928dd3] focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(146,141,211,0.15)] transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[13px] text-[#928dd3]/80 hover:text-[#928dd3] transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {error ? (
              <div className="p-3 rounded-[8px] bg-[#ff6b6b]/10 border border-[#ff6b6b]/20">
                <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[#ff6b6b]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  {error}
                </p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-[8px] h-[48px] rounded-[12px] bg-gradient-to-r from-[#928dd3] to-[#a89be6] font-['Archivo:SemiBold',sans-serif] font-semibold text-[15px] leading-[20px] text-black transition-all duration-300 hover:opacity-90 shadow-[0_0_20px_rgba(146,141,211,0.3)] hover:shadow-[0_0_30px_rgba(146,141,211,0.5)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>

            <p className="text-center text-[13px] text-white/50">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-[#928dd3] hover:text-[#a89be6] transition-colors">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

