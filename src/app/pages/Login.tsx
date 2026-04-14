import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => name.trim().length > 0 && !isSubmitting, [name, isSubmitting]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);

      await login({ name: name.trim() });
      navigate("/", { replace: true });
    } catch {
      setError("Ha ocurrido un error. Intenta nuevamente.");
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
              Inicia sesion para acceder a tu panel.
            </p>
          </div>

          <form className="flex flex-col gap-[14px]" onSubmit={onSubmit}>
            <label className="flex flex-col gap-[8px]" htmlFor="login-name">
              <span className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                Nombre
              </span>
              <input
                id="login-name"
                type="text"
                autoComplete="username"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ingresa tu nombre"
                className="h-[44px] rounded-[8px] border border-white bg-black px-[12px] text-white placeholder:text-[rgba(255,255,255,0.45)] outline-none focus:border-[#928dd3]"
              />
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
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px] border border-solid border-white" />
      </div>
    </div>
  );
}

