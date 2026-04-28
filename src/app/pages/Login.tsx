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
    <div className="bg-black flex h-screen w-screen items-center justify-center px-[24px]">
      <div className="bg-black relative w-full max-w-[480px] rounded-[16px]">
        <div className="content-stretch flex flex-col gap-[20px] p-[28px]">
          <div className="flex flex-col gap-[6px]">
            <p className="font-['Chivo:Black',sans-serif] font-black leading-[40px] text-[34px] tracking-[-0.34px] text-white">
              Login
            </p>
            <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
              Sign in to open your dashboard.
            </p>
          </div>

          <form className="flex flex-col gap-[14px]" onSubmit={onSubmit}>
            <label className="flex flex-col gap-[8px]" htmlFor="login-name">
              <span className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                Username
              </span>
              <input
                id="login-name"
                type="text"
                autoComplete="username"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your username"
                className="h-[44px] rounded-[8px] border border-white bg-black px-[12px] text-white placeholder:text-[rgba(255,255,255,0.45)] outline-none focus:border-[#928dd3]"
              />
            </label>

            <label className="flex flex-col gap-[8px]" htmlFor="login-password">
              <span className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
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
                  className="h-[44px] w-full rounded-[8px] border border-white bg-black px-[12px] pr-[90px] text-white placeholder:text-[rgba(255,255,255,0.45)] outline-none focus:border-[#928dd3]"
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

            {error ? (
              <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[#ff6b6b]" style={{ fontVariationSettings: "'wdth' 100" }}>
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-[4px] h-[44px] rounded-[8px] bg-[#928dd3] font-['Archivo:SemiBold',sans-serif] font-semibold text-[15px] leading-[20px] text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>

            <p className="text-center text-[13px] text-[rgba(255,255,255,0.6)]">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-[#928dd3] hover:underline">
                Register here
              </Link>
            </p>
          </form>
        </div>
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px] border border-solid border-white" />
      </div>
    </div>
  );
}

