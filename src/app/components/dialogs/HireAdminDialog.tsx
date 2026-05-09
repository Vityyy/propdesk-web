import { useEffect, useState } from "react";
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-[rgba(255,255,255,0.16)] rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-4">Hire Administrator</h2>

        {/* Admin Username Input */}
        <div className="mb-4">
          <label className="block font-['Archivo:SemiBold',sans-serif] font-semibold text-[15px] text-white mb-2">
            Admin Username
          </label>
          <input
            type="text"
            value={adminUsername}
            onChange={(e) => setAdminUsername(e.target.value)}
            placeholder="Enter admin username..."
            className="w-full bg-black border border-[rgba(255,255,255,0.16)] rounded-[8px] px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#928dd3]"
          />
          <p className="font-['Archivo:Medium',sans-serif] font-medium text-[13px] text-[rgba(255,255,255,0.6)] mt-1">
            Type the exact username of the admin you want to hire
          </p>
        </div>

        {/* Admin Cut */}
        {adminUsername.trim() && (
          <div className="mb-4">
            <label className="block font-['Archivo:SemiBold',sans-serif] font-semibold text-[15px] text-white mb-2">
              Admin Commission (%)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={adminCut}
              onChange={(e) => setAdminCut(e.target.value)}
              className="w-full bg-black border border-[rgba(255,255,255,0.16)] rounded-[8px] px-3 py-2 text-white focus:outline-none focus:border-[#928dd3]"
            />
            <p className="font-['Archivo:Medium',sans-serif] font-medium text-[13px] text-[rgba(255,255,255,0.6)] mt-1">
              Percentage you offer this admin for managing your properties
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-[8px] bg-red-500/10 border border-red-500/30">
            <p className="font-['Archivo:Medium',sans-serif] font-medium text-[13px] text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 rounded-[8px] bg-green-500/10 border border-green-500/30">
            <p className="font-['Archivo:Medium',sans-serif] font-medium text-[13px] text-green-400">
              ✓ Request sent successfully! Waiting for admin approval...
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 rounded-[8px] border border-[rgba(255,255,255,0.16)] text-white font-semibold hover:border-red-400 hover:text-red-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleHire}
            disabled={!adminUsername.trim() || loading}
            className="flex-1 px-4 py-2 rounded-[8px] bg-[#928dd3] text-black font-semibold hover:bg-[#7f7ab8] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Hiring..." : "Hire Admin"}
          </button>
        </div>
      </div>
    </div>
  );
}
