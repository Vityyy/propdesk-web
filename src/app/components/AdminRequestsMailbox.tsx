import { useEffect, useState } from "react";
import userService, { type OwnerAssociationRequestSummary } from "../../services/userService";
import { ApiError } from "../../utils/httpUtils";

function MailboxIcon({ count }: { count: number }) {
  return (
    <div className="relative">
      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
      {count > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-[rgba(255,255,255,0.16)] rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-4">Pending Requests</h2>

        {requests.length === 0 && (
          <p className="font-['Archivo:Medium',sans-serif] font-medium text-[13px] text-[rgba(255,255,255,0.6)] mb-4">
            No pending owner requests
          </p>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-[8px] bg-red-500/10 border border-red-500/30">
            <p className="font-['Archivo:Medium',sans-serif] font-medium text-[13px] text-red-400">
              {error}
            </p>
          </div>
        )}

        <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
          {requests.map((request) => (
            <div key={request.ownerId} className="rounded-[8px] border border-[rgba(255,255,255,0.16)] px-3 py-3">
              <p className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[15px] text-white mb-1">
                {request.ownerName}
              </p>
              <p className="font-['Archivo:Medium',sans-serif] font-medium text-[13px] text-[rgba(255,255,255,0.6)] mb-3">
                Commission: {request.adminCut ?? 0}%
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(request.ownerId)}
                  disabled={accepting === request.ownerId || rejecting === request.ownerId}
                  className="flex-1 px-3 py-2 rounded-[6px] bg-[#928dd3] text-black font-semibold text-[13px] hover:bg-[#7f7ab8] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {accepting === request.ownerId ? "Accepting..." : "Accept"}
                </button>
                <button
                  onClick={() => handleReject(request.ownerId)}
                  disabled={rejecting === request.ownerId || accepting === request.ownerId}
                  className="flex-1 px-3 py-2 rounded-[6px] border border-red-500/50 text-red-400 font-semibold text-[13px] hover:bg-red-500/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {rejecting === request.ownerId ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 rounded-[8px] border border-[rgba(255,255,255,0.16)] text-white font-semibold hover:border-gray-400 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
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
        className="relative inline-flex items-center justify-center gap-3 rounded-full border border-red-500/35 bg-red-500/10 px-4 py-3 text-white shadow-[0_0_0_1px_rgba(239,68,68,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:border-red-400 hover:bg-red-500/15 hover:shadow-[0_10px_24px_rgba(239,68,68,0.18)]"
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