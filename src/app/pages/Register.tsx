import { FormEvent, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";

type UserType = "admin" | "owner";

export function Register() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [userType, setUserType] = useState<UserType>("owner");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const passwordError = password !== confirmPassword && confirmPassword.length > 0 ? "Las contraseñas no coinciden" : null;

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
    } catch (err) {
      setError("Ha ocurrido un error al registrarse. Intenta nuevamente.");
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
              Registrarse
            </p>
            <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'wdth' 100" }}>
              Crea una cuenta para acceder al panel.
            </p>
          </div>

          <form className="flex flex-col gap-[14px]" onSubmit={onSubmit}>
            <label className="flex flex-col gap-[8px]" htmlFor="register-type">
              <span className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                Tipo de cuenta
              </span>
              <select
                id="register-type"
                value={userType}
                onChange={(event) => setUserType(event.target.value as UserType)}
                className="h-[44px] rounded-[8px] border border-white bg-black px-[12px] text-white outline-none focus:border-[#928dd3]"
              >
                <option value="owner">Propietario</option>
                <option value="admin">Administrador</option>
              </select>
            </label>

            <label className="flex flex-col gap-[8px]" htmlFor="register-name">
              <span className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                Nombre
              </span>
              <input
                id="register-name"
                type="text"
                autoComplete="username"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ingresa tu nombre completo"
                className="h-[44px] rounded-[8px] border border-white bg-black px-[12px] text-white placeholder:text-[rgba(255,255,255,0.45)] outline-none focus:border-[#928dd3]"
              />
            </label>

            <label className="flex flex-col gap-[8px]" htmlFor="register-password">
              <span className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                Contraseña
              </span>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Ingresa una contraseña"
                className="h-[44px] rounded-[8px] border border-white bg-black px-[12px] text-white placeholder:text-[rgba(255,255,255,0.45)] outline-none focus:border-[#928dd3]"
              />
            </label>

            <label className="flex flex-col gap-[8px]" htmlFor="register-confirm-password">
              <span className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] text-[15px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                Confirmar contraseña
              </span>
              <input
                id="register-confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirma tu contraseña"
                className="h-[44px] rounded-[8px] border border-white bg-black px-[12px] text-white placeholder:text-[rgba(255,255,255,0.45)] outline-none focus:border-[#928dd3]"
              />
            </label>

            {passwordError ? (
              <p className="font-['Archivo:Medium',sans-serif] font-medium leading-[16px] text-[13px] text-[#ff6b6b]" style={{ fontVariationSettings: "'wdth' 100" }}>
                {passwordError}
              </p>
            ) : null}

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
              {isSubmitting ? "Registrando..." : "Registrarse"}
            </button>

            <p className="text-center text-[13px] text-[rgba(255,255,255,0.6)]">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-[#928dd3] hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </form>
        </div>
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px] border border-solid border-white" />
      </div>
    </div>
  );
}
