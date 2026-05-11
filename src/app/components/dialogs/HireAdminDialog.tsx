import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ApiError } from "../../../utils/httpUtils";
import userService, {
  type AdminSummary,
  type OwnerAdminAssociationResponse,
} from "../../../services/userService";

interface HireAdminDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (response: OwnerAdminAssociationResponse) => void;
}

export function HireAdminDialog({ isOpen, onClose, onSuccess }: HireAdminDialogProps) {
  const [admins, setAdmins] = useState<AdminSummary[]>([]);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminCut, setAdminCut] = useState("10");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let ignore = false;

    const loadAdmins = async () => {
      try {
        setError(null);
        const adminsList = await userService.listAdmins();

        if (!ignore) {
          setAdmins(adminsList);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof ApiError ? err.message : "No se pudieron cargar los admins");
        }
      }
    };

    loadAdmins();

    return () => {
      ignore = true;
    };
  }, [isOpen]);

  const handleHire = async () => {
    if (!adminUsername.trim() || loading) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const normalizedUsername = adminUsername.trim();
      const matchedAdmin = admins.find((admin) => admin.name.trim() === normalizedUsername);

      if (!matchedAdmin) {
        setError("Admin seleccionado no existe");
        return;
      }

      const response = await userService.associateAdmin({
        adminId: matchedAdmin.id,
        adminCut: adminCut.trim() ? Number(adminCut) : undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess(response);
        handleClose();
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? err.message
        : "Admin seleccionado no existe";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAdminUsername("");
    setAdminCut("10");
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[var(--bg-deep)] border border-[var(--glass-border)] rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.8)] max-w-md w-full relative overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-5 border-b border-[var(--glass-border)] flex items-center justify-between bg-[var(--bg-deep)]">
          <h2 className="font-['Chivo:Black',sans-serif] font-black text-xl text-[var(--text-primary)]">Hire Administrator</h2>
          <button
            onClick={handleClose}
            className="p-2 text-[var(--text-secondary)] bg-[var(--bg-subtle)] rounded-full transition-colors hover:text-[var(--text-primary)] hover:bg-[var(--glass-border)] shadow-sm"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          {/* Admin Username Input */}
          <div className="mb-5">
            <label className="block font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px] text-[var(--text-secondary)] mb-2">
              Admin Username
            </label>
            <input
              type="text"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              placeholder="Enter admin username..."
              className="w-full bg-[var(--bg-subtle)] border border-[var(--glass-border)] rounded-[8px] px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[#928dd3] focus:bg-[var(--bg-subtle)] transition-all duration-300 font-['Archivo:Medium',sans-serif]"
            />
            <p className="font-['Archivo:Medium',sans-serif] font-medium text-[12px] text-[var(--text-tertiary)] mt-2">
              Type the exact username of the admin you want to hire
            </p>
          </div>

          {/* Admin Cut */}
          {adminUsername.trim() && (
            <div className="mb-5 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px] text-[var(--text-secondary)] mb-2">
                Admin Commission (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={adminCut}
                onChange={(e) => setAdminCut(e.target.value)}
                className="w-full bg-[var(--bg-subtle)] border border-[var(--glass-border)] rounded-[8px] px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[#928dd3] focus:bg-[var(--bg-subtle)] transition-all duration-300 font-['Archivo:Medium',sans-serif]"
              />
              <p className="font-['Archivo:Medium',sans-serif] font-medium text-[12px] text-[var(--text-tertiary)] mt-2">
                Percentage you offer this admin for managing your properties
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-[8px] bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 animate-in fade-in">
              <p className="font-['Archivo:Medium',sans-serif] font-medium text-[13px] text-[#ff6b6b]">
                {error}
              </p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-5 p-3.5 rounded-[8px] bg-[#0DC44A]/10 border border-[#0DC44A]/30 animate-in fade-in">
              <p className="font-['Archivo:Medium',sans-serif] font-medium text-[13px] text-[#0DC44A]">
                ✓ Request sent successfully! Waiting for admin approval...
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 bg-[var(--bg-subtle)] border border-[var(--glass-border)] text-[var(--text-primary)] font-['Archivo:SemiBold',sans-serif] font-semibold text-sm rounded-[8px] transition-colors hover:bg-[var(--glass-border)]"
            >
              Cancel
            </button>
            <button
              onClick={handleHire}
              disabled={!adminUsername.trim() || loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#928dd3] to-[#a89be6] text-black font-['Archivo:SemiBold',sans-serif] font-semibold text-sm rounded-[8px] transition-all duration-300 hover:opacity-90 shadow-[0_0_15px_rgba(146,141,211,0.4)] hover:shadow-[0_0_25px_rgba(146,141,211,0.7)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {loading ? "Hiring..." : "Hire Admin"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
