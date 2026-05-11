import { FormEvent, useMemo, useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { Building2, Briefcase, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { ApiError } from "../../utils/httpUtils";

type UserType = "admin" | "owner";

export function Register() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [userType, setUserType] = useState<UserType>("owner");

  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className="absolute top-4 right-4 p-2 rounded-lg transition-all duration-300 hover:bg-white/10 dark:hover:bg-white/10 text-secondary hover:text-primary light:text-black light:hover:bg-black/5 z-20"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmRef = useRef<HTMLInputElement | null>(null);

  const handleEnterToNext = (
    event: React.KeyboardEvent<HTMLInputElement>,
    nextRef?: React.RefObject<HTMLInputElement | null>,
  ) => {
    if (event.key !== "Enter" || !nextRef?.current) {
      return;
    }

    event.preventDefault();
    nextRef.current.focus();
  };

  const canSubmit = useMemo(() => {
    if (isSubmitting) return false;
    if (name.trim().length === 0) return false;
    if (password.trim().length === 0) return false;
    if (confirmPassword.trim().length === 0) return false;
    if (password !== confirmPassword) return false;
    return true;
  }, [name, password, confirmPassword, isSubmitting]);

  const passwordError = password !== confirmPassword && confirmPassword.length > 0 ? "Passwords do not match" : null;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);

      await signup(
        { name: name.trim(), password: password.trim() },
        userType
      );
      navigate("/", { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        setError(`Error ${error.status}: ${error.message || "Registration could not be completed."}`);
      } else {
        setError("Something went wrong while registering. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-deep flex min-h-screen w-screen items-center justify-center px-[24px] py-[40px] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#928dd3]/8 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-[300px] h-[300px] bg-[#928dd3]/5 blur-[100px] rounded-full pointer-events-none" />
      
      <ThemeToggle />
      
      <div className="dark:bg-[#0a0a0f]/95 light:bg-white dark:border-white/[0.08] light:border-black/[0.08] relative w-full max-w-[480px] rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-[#928dd3]/5 via-transparent to-transparent" />
        <div className="content-stretch flex flex-col gap-[20px] p-[28px] relative">
          <div className="flex flex-col gap-[6px]">
            <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] text-[34px] tracking-[-0.34px] text-primary">
              Sign up
            </p>
            <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[15px] text-tertiary" style={{ fontVariationSettings: "'wdth' 100" }}>
              Create an account to access the dashboard.
            </p>
          </div>

          <form className="flex flex-col gap-[14px]" onSubmit={onSubmit}>
            <div className="flex flex-col gap-[8px]">
              <span className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-secondary" style={{ fontVariationSettings: "'wdth' 100" }}>
                Account type
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("owner")}
                  className={`flex-1 p-3 rounded-[12px] border transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(146,141,211,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#928dd3]/40 ${
                    userType === "owner" 
                      ? "bg-[#928dd3]/10 border-[#928dd3]/50 text-[#928dd3] light:text-[#6b5cb8] shadow-[0_0_15px_rgba(146,141,211,0.15)]" 
                      : "bg-white/[0.02] border-white/[0.08] text-tertiary hover:border-white/20 hover:bg-white/[0.04] light:bg-black/5 light:border-black/10 light:text-[#4b5563] light:hover:bg-black/10"
                  }`}
                >
                  <Building2 size={18} />
                  <span className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px]">Owner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("admin")}
                  className={`flex-1 p-3 rounded-[12px] border transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(146,141,211,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#928dd3]/40 ${
                    userType === "admin" 
                      ? "bg-[#928dd3]/10 border-[#928dd3]/50 text-[#928dd3] light:text-[#6b5cb8] shadow-[0_0_15px_rgba(146,141,211,0.15)]" 
                      : "bg-white/[0.02] border-white/[0.08] text-tertiary hover:border-white/20 hover:bg-white/[0.04] light:bg-black/5 light:border-black/10 light:text-[#4b5563] light:hover:bg-black/10"
                  }`}
                >
                  <Briefcase size={18} />
                  <span className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px]">Admin</span>
                </button>
              </div>
            </div>

            <label className="flex flex-col gap-[8px]" htmlFor="register-name">
              <span className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-secondary" style={{ fontVariationSettings: "'wdth' 100" }}>
                Username
              </span>
              <input
                id="register-name"
                type="text"
                autoComplete="username"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={(event) => handleEnterToNext(event, passwordRef)}
                ref={nameRef}
                placeholder="Choose a username"
                className="h-[48px] rounded-[12px] border border-[var(--glass-border)] dark:bg-[#151520] light:bg-white light:border-black/10 px-[16px] text-primary light:text-[#111827] placeholder:text-[var(--text-tertiary)] light:placeholder:text-[#9ca3af] outline-none transition-all duration-300 hover:border-[#928dd3]/40 hover:shadow-[0_0_0_3px_rgba(146,141,211,0.12)] focus:border-[#928dd3] focus:ring-1 focus:ring-[#928dd3]/30"
              />
            </label>

            <label className="flex flex-col gap-[8px]" htmlFor="register-password">
              <span className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-secondary" style={{ fontVariationSettings: "'wdth' 100" }}>
                Password
              </span>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={(event) => handleEnterToNext(event, confirmRef)}
                  ref={passwordRef}
                  placeholder="Choose a password"
                  className="h-[48px] w-full rounded-[12px] border border-white/[0.08] bg-white/[0.02] px-[16px] pr-[90px] text-primary placeholder-white/25 outline-none transition-all duration-300 dark:focus:border-[#928dd3] dark:focus:bg-white/[0.05] dark:focus:shadow-[0_0_0_3px_rgba(146,141,211,0.15)] light:bg-white light:border-black/10 light:text-[#111827] light:placeholder:text-[#9ca3af] light:hover:border-[#928dd3]/40 light:focus:border-[#928dd3] light:focus:shadow-[0_0_0_3px_rgba(146,141,211,0.12)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[13px] text-[#928dd3]/80 hover:text-[#928dd3] transition-colors light:text-[#6b5cb8]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <label className="flex flex-col gap-[8px]" htmlFor="register-confirm-password">
              <span className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-secondary" style={{ fontVariationSettings: "'wdth' 100" }}>
                Confirm password
              </span>
              <div className="relative">
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  ref={confirmRef}
                  placeholder="Re-enter your password"
                  className="h-[48px] w-full rounded-[12px] border border-white/[0.08] bg-white/[0.02] px-[16px] pr-[90px] text-primary placeholder-white/25 outline-none transition-all duration-300 dark:focus:border-[#928dd3] dark:focus:bg-white/[0.05] dark:focus:shadow-[0_0_0_3px_rgba(146,141,211,0.15)] light:bg-white light:border-black/10 light:text-[#111827] light:placeholder:text-[#9ca3af] light:hover:border-[#928dd3]/40 light:focus:border-[#928dd3] light:focus:shadow-[0_0_0_3px_rgba(146,141,211,0.12)]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[13px] text-[#928dd3]/80 hover:text-[#928dd3] transition-colors light:text-[#6b5cb8]"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {passwordError ? (
              <div className="p-3 rounded-[8px] bg-[#ff6b6b]/10 border border-[#ff6b6b]/20">
                <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[#ff6b6b]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  {passwordError}
                </p>
              </div>
            ) : null}

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
              className="mt-[8px] h-[48px] rounded-[12px] bg-gradient-to-r from-[#928dd3] to-[#a89be6] font-['Archivo:SemiBold',sans-serif] font-semibold text-[15px] leading-[20px] text-black transition-all duration-300 hover:opacity-90 shadow-[0_0_20px_rgba(146,141,211,0.3)] hover:shadow-[0_0_30px_rgba(146,141,211,0.5)] hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#928dd3]/40 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {isSubmitting ? "Creating account…" : "Create account"}
            </button>

            <p className="text-center text-[13px] text-tertiary">
              Already have an account?{" "}
              <Link to="/login" className="text-[#928dd3] hover:text-[#a89be6] transition-colors">
                Sign in here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
