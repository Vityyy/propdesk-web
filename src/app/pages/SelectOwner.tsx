import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Building2, LogOut, ShieldAlert, User, CheckCircle2 } from 'lucide-react';
import authService from '../../services/authService';
import { AdminRequestsMailbox } from '../components/AdminRequestsMailbox';
import { useAuth } from '../context/AuthContext';
import { useOwner } from '../context/OwnerContext';

export function SelectOwner() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { owners, currentOwner, setCurrentOwner } = useOwner();

  const [localSelectedOwnerId, setLocalSelectedOwnerId] = useState<string>(() => {
    return currentOwner?.id || (owners.length > 0 ? owners[0].id : '');
  });

  const handleConfirm = () => {
    const ownerToSelect = owners.find(o => o.id === localSelectedOwnerId);
    if (ownerToSelect) {
      setCurrentOwner(ownerToSelect);
      navigate('/');
    }
  };

  useEffect(() => {
    const isAdmin = authService.getCurrentUserRole() === 'ADMIN';
    
    if (!isAdmin) {
      navigate('/');
      return;
    }

    // Auto-select if only one owner
    if (owners.length === 1 && owners[0].id !== currentOwner.id) {
      setCurrentOwner(owners[0]);
      navigate('/');
      return;
    }

    // If already have selected owner, go to dashboard
    const storedOwnerId = sessionStorage.getItem('selectedOwnerId');
    if (storedOwnerId && owners.some(o => o.id === storedOwnerId)) {
      navigate('/');
      return;
    }
  }, [owners, currentOwner, navigate, setCurrentOwner]);

  if (owners.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#928dd3]/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="text-center max-w-md w-full relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.8)] p-8 backdrop-blur-md relative overflow-hidden">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#ff6b6b]/10 flex items-center justify-center ring-1 ring-[#ff6b6b]/30">
                <ShieldAlert className="text-[#ff6b6b]" size={32} />
              </div>
            </div>
            
            <h1 className="font-['Chivo:Black',sans-serif] font-black text-2xl text-white mb-3">
              Pending Invitations
            </h1>
            <p className="font-['Archivo:Medium',sans-serif] font-medium text-[15px] text-[#ff6b6b] mb-6">
              You do not have any associated owners yet
            </p>
            <p className="font-['Archivo:Medium',sans-serif] font-medium text-[14px] text-white/50 mb-8 px-4">
              Use the mailbox below to review pending owner invitations. When an owner hires you, their request will appear here.
            </p>
            
            <div className="flex justify-center mb-8 relative z-20">
              <AdminRequestsMailbox />
            </div>
            
            <div className="pt-6 border-t border-white/10">
              <button
                onClick={() => {
                  logout();
                  navigate('/login', { replace: true });
                }}
                className="w-full px-4 py-3 rounded-[12px] bg-white/[0.03] border border-white/10 text-white/80 font-['Archivo:SemiBold',sans-serif] font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#ff6b6b]/10 hover:border-[#ff6b6b]/30 hover:text-[#ff6b6b]"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#928dd3]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="bg-[#0a0a0f] border border-white/10 rounded-[24px] p-8 max-w-md w-full shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#928dd3]/10 flex items-center justify-center ring-1 ring-[#928dd3]/30">
            <Building2 className="text-[#928dd3]" size={32} />
          </div>
        </div>

        <h1 className="font-['Chivo:Black',sans-serif] font-black text-[28px] text-white mb-2 text-center tracking-tight">
          Select Workspace
        </h1>
        <p className="font-['Archivo:Medium',sans-serif] font-medium text-[15px] text-white/50 text-center mb-8">
          Choose the owner workspace you want to manage
        </p>

        <div className="space-y-3 mb-8">
          {owners.map((owner) => {
            const isSelected = localSelectedOwnerId === owner.id;
            return (
              <button
                key={owner.id}
                onClick={() => setLocalSelectedOwnerId(owner.id)}
                className={`w-full p-4 rounded-[16px] border transition-all duration-300 flex items-center justify-between group ${
                  isSelected
                    ? 'bg-[#928dd3]/10 border-[#928dd3]/50 shadow-[0_0_15px_rgba(146,141,211,0.15)]'
                    : 'bg-white/[0.02] border-white/10 hover:border-[#928dd3]/40 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-[#928dd3]/20 text-[#928dd3]' : 'bg-white/5 text-white/50 group-hover:text-[#928dd3]'
                  }`}>
                    <User size={18} />
                  </div>
                  <div className="text-left">
                    <span className={`block font-['Archivo:SemiBold',sans-serif] font-semibold text-[16px] transition-colors ${
                      isSelected ? 'text-[#928dd3]' : 'text-white group-hover:text-white/90'
                    }`}>
                      {owner.name}
                    </span>
                    <span className="block font-['Archivo:Medium',sans-serif] font-medium text-[13px] text-white/40 mt-0.5">
                      Property Owner
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="text-[#928dd3] animate-in zoom-in duration-300" size={20} />
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-6 border-t border-white/10 flex justify-between items-center">
          <button
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
            className="px-4 py-2 rounded-[8px] bg-transparent text-white/50 font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px] flex items-center gap-2 transition-all duration-300 hover:bg-white/5 hover:text-white"
          >
            <LogOut size={16} />
            Log Out
          </button>
          
          <button
            onClick={handleConfirm}
            disabled={!localSelectedOwnerId}
            className="px-6 py-2.5 rounded-[8px] bg-gradient-to-r from-[#928dd3] to-[#a89be6] text-black font-['Archivo:SemiBold',sans-serif] font-semibold text-[14px] transition-all duration-300 hover:opacity-90 shadow-[0_0_15px_rgba(146,141,211,0.4)] hover:shadow-[0_0_25px_rgba(146,141,211,0.7)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
