import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Mail, X } from "lucide-react";
import userService, { type OwnerAssociationRequestSummary } from "../../services/userService";
import { ApiError } from "../../utils/httpUtils";

function MailboxIcon({ count }: { count: number }) {
  return (
    <div className="relative">
      <Mail size={22} className={count > 0 ? "text-[#928dd3]" : "text-white/60"} />
      {count > 0 && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#928dd3] to-[#a89be6] text-black rounded-full w-5 h-5 flex items-center justify-center text-[11px] font-bold shadow-sm">
          {count > 9 ? "9+" : count}
        </div>
      )}
    </div>
  );
}

interface PendingRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: OwnerAssociationRequestSummary[];
  onAccept: (ownerId: string) => Promise<void>;
  onReject: (ownerId: string) => Promise<void>;
}

function PendingRequestsModal({ isOpen, onClose, requests, onAccept, onReject }: PendingRequestsModalProps) {
  const [accepting, setAccepting] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async (ownerId: string) => {
    try {
      setError(null);
      setAccepting(ownerId);
      await onAccept(ownerId);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : (err instanceof Error ? err.message : "Error accepting request");
      setError(errorMessage);
    } finally {
      setAccepting(null);
    }
  };

  const handleReject = async (ownerId: string) => {
    try {
      setError(null);
      setRejecting(ownerId);
      await onReject(ownerId);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : (err instanceof Error ? err.message : "Error rejecting request");
      setError(errorMessage);
    } finally {
      setRejecting(null);
    }
  };

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-subtle border border-[var(--glass-border)] rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.2)] max-w-md w-full relative overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 pb-5 border-b border-[var(--glass-border)] flex items-center justify-between bg-subtle shrink-0">
          <h2 className="font-['Chivo:Black',sans-serif] font-black text-xl text-primary">Pending Requests</h2>
          <button
            onClick={onClose}
            className="p-2 text-secondary bg-white/[0.05] rounded-full transition-colors hover:text-primary hover:bg-white/[0.1] shadow-sm"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {requests.length === 0 && (
            <div className="text-center py-8">
              <p className="font-['Archivo:Medium',sans-serif] font-medium text-[14px] text-tertiary">
                No pending owner requests at the moment.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 rounded-[8px] bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 animate-in fade-in">
              <p className="font-['Archivo:Medium',sans-serif] font-medium text-[13px] text-[#ff6b6b]">
                {error}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.ownerId} className="glass-card rounded-[12px] p-5 hover:border-[#928dd3]/30 transition-all duration-300 group">
                <div className="mb-4">
                  <p className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[16px] text-primary">
                    {request.ownerName}
                  </p>
                  <p className="font-['Archivo:Medium',sans-serif] font-medium text-[13px] text-secondary mt-1">
                    Offered Commission: <span className="text-[#928dd3] font-semibold">{request.adminCut ?? 0}%</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAccept(request.ownerId)}
                    disabled={accepting === request.ownerId || rejecting === request.ownerId}
                    className="flex-1 px-3 py-2 rounded-[8px] bg-[#0DC44A]/10 border border-[#0DC44A]/30 text-[#0DC44A] font-['Archivo:SemiBold',sans-serif] font-semibold text-[13px] hover:bg-[#0DC44A] hover:text-black transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {accepting === request.ownerId ? "Accepting..." : "Accept"}
                  </button>
                  <button
                    onClick={() => handleReject(request.ownerId)}
                    disabled={rejecting === request.ownerId || accepting === request.ownerId}
                    className="flex-1 px-3 py-2 rounded-[8px] bg-white/[0.03] border border-[var(--glass-border)] text-secondary font-['Archivo:SemiBold',sans-serif] font-semibold text-[13px] hover:bg-[#ff6b6b]/10 hover:border-[#ff6b6b]/30 hover:text-[#ff6b6b] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {rejecting === request.ownerId ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function AdminRequestsMailbox() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<OwnerAssociationRequestSummary[]>([]);

  useEffect(() => {
    let ignore = false;

    const loadRequests = async () => {
      try {
        const requests = await userService.listPendingOwnerRequests();

        if (!ignore) {
          setPendingRequests(requests);
        }
      } catch (error) {
        console.error("Error loading pending requests:", error);
      }
    };

    loadRequests();

    return () => {
      ignore = true;
    };
  }, []);

  const handleAccept = async (ownerId: string) => {
    try {
      await userService.acceptOwnerRequest(ownerId);
      setPendingRequests((prev) => prev.filter((request) => request.ownerId !== ownerId));
      window.location.reload();
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : (err instanceof Error ? err.message : "Failed to accept request");
      throw new Error(errorMessage);
    }
  };

  const handleReject = async (ownerId: string) => {
    try {
      await userService.rejectOwnerRequest(ownerId);
      setPendingRequests((prev) => prev.filter((request) => request.ownerId !== ownerId));
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : (err instanceof Error ? err.message : "Failed to reject request");
      throw new Error(errorMessage);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`relative inline-flex items-center justify-center rounded-full border px-3.5 py-3.5 transition-all duration-300 hover:-translate-y-0.5 ${
          pendingRequests.length > 0 
            ? "border-[#928dd3]/50 bg-[#928dd3]/20 shadow-[0_0_20px_rgba(146,141,211,0.3)] hover:border-[#928dd3]/80 hover:bg-[#928dd3]/30 hover:shadow-[0_0_30px_rgba(146,141,211,0.5)]" 
            : "border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20 hover:shadow-[0_8px_20px_rgba(255,255,255,0.08)]"
        }`}
        data-name="admin-mailbox"
        type="button"
      >
        <MailboxIcon count={pendingRequests.length} />
      </button>
      <PendingRequestsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        requests={pendingRequests}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </>
  );
}