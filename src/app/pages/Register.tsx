import { FormEvent, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router";
import { Building2, Briefcase } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../../utils/httpUtils";

type UserType = "admin" | "owner";

export function Register() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [userType, setUserType] = useState<UserType>("owner");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="bg-black flex min-h-screen w-screen items-center justify-center px-[24px] py-[40px] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#928dd3]/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="bg-[#0a0a0f] border border-white/10 relative w-full max-w-[480px] rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-md z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="content-stretch flex flex-col gap-[20px] p-[28px]">
          <div className="flex flex-col gap-[6px]">
            <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] text-[34px] tracking-[-0.34px] text-white">
              Sign up
            </p>
            <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
              Create an account to access the dashboard.
            </p>
          </div>

          <form className="flex flex-col gap-[14px]" onSubmit={onSubmit}>
            <div className="flex flex-col gap-[8px]">
              <span className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                Account type
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("owner")}
                  className={`flex-1 p-3 rounded-[12px] border transition-all duration-300 flex items-center justify-center gap-2 ${
                    userType === "owner" 
                      ? "bg-[#928dd3]/10 border-[#928dd3]/50 text-[#928dd3] shadow-[0_0_15px_rgba(146,141,211,0.15)]" 
                      : "bg-white/[0.03] border-white/10 text-white/50 hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
                >
                  <Building2 size={18} />
                  <span className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px]">Owner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("admin")}
                  className={`flex-1 p-3 rounded-[12px] border transition-all duration-300 flex items-center justify-center gap-2 ${
                    userType === "admin" 
                      ? "bg-[#928dd3]/10 border-[#928dd3]/50 text-[#928dd3] shadow-[0_0_15px_rgba(146,141,211,0.15)]" 
                      : "bg-white/[0.03] border-white/10 text-white/50 hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
                >
                  <Briefcase size={18} />
                  <span className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px]">Admin</span>
                </button>
              </div>
            </div>

            <label className="flex flex-col gap-[8px]" htmlFor="register-name">
              <span className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                Username
              </span>
              <input
                id="register-name"
                type="text"
                autoComplete="username"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Choose a username"
                className="h-[48px] rounded-[12px] border border-white/10 bg-white/[0.03] px-[16px] text-white placeholder-white/30 outline-none focus:border-[#928dd3] focus:bg-white/[0.05] transition-all duration-300"
              />
            </label>

            <label className="flex flex-col gap-[8px]" htmlFor="register-password">
              <span className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                Password
              </span>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Choose a password"
                  className="h-[48px] w-full rounded-[12px] border border-white/10 bg-white/[0.03] px-[16px] pr-[90px] text-white placeholder-white/30 outline-none focus:border-[#928dd3] focus:bg-white/[0.05] transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[13px] text-[#928dd3] hover:underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <label className="flex flex-col gap-[8px]" htmlFor="register-confirm-password">
              <span className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                Confirm password
              </span>
              <div className="relative">
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter your password"
                  className="h-[48px] w-full rounded-[12px] border border-white/10 bg-white/[0.03] px-[16px] pr-[90px] text-white placeholder-white/30 outline-none focus:border-[#928dd3] focus:bg-white/[0.05] transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[13px] text-[#928dd3] hover:underline"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {passwordError ? (
              <div className="p-3 rounded-[8px] bg-[#ff6b6b]/10 border border-[#ff6b6b]/30">
                <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[#ff6b6b]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  {passwordError}
                </p>
              </div>
            ) : null}

            {error ? (
              <div className="p-3 rounded-[8px] bg-[#ff6b6b]/10 border border-[#ff6b6b]/30">
                <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[#ff6b6b]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  {error}
                </p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-[8px] h-[48px] rounded-[12px] bg-gradient-to-r from-[#928dd3] to-[#a89be6] font-['Archivo:SemiBold',sans-serif] font-semibold text-[15px] leading-[20px] text-black transition-all duration-300 hover:opacity-90 shadow-[0_0_15px_rgba(146,141,211,0.4)] hover:shadow-[0_0_25px_rgba(146,141,211,0.7)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {isSubmitting ? "Creating account…" : "Create account"}
            </button>

            <p className="text-center text-[13px] text-[rgba(255,255,255,0.6)]">
              Already have an account?{" "}
              <Link to="/login" className="text-[#928dd3] hover:underline">
                Sign in here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
