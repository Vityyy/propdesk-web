import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import authService from '../../services/authService';
import { useAuth } from '../context/AuthContext';
import { useOwner } from '../context/OwnerContext';

export function SelectOwner() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { owners, currentOwner, setCurrentOwner } = useOwner();

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
        <div className="text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-white mb-4">Select Owner</h1>
          <p className="text-red-400 text-lg mb-6">You do not have any associated owners</p>
          <p className="text-gray-400 mb-6">
            If you already have owner requests, go to Settings to accept them. Otherwise, an owner must first associate you as an administrator.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/settings')}
              className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors"
            >
              Go to Settings
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
              className="w-full px-4 py-3 rounded-lg border border-[rgba(255,255,255,0.16)] text-white font-semibold hover:border-red-400 hover:text-red-400 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-black border border-[rgba(255,255,255,0.16)] rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Select Owner
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Choose the owner you want to manage
        </p>

        <div className="space-y-3">
          {owners.map((owner) => (
            <button
              key={owner.id}
              onClick={() => {
                setCurrentOwner(owner);
                navigate('/');
              }}
              className={`w-full px-4 py-3 rounded-lg border transition-all ${
                currentOwner.id === owner.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-black border-[rgba(255,255,255,0.16)] text-white hover:border-blue-500'
              }`}
            >
              <span className="font-semibold">{owner.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={() => navigate('/settings')}
            className="w-full px-4 py-3 rounded-lg border border-[rgba(255,255,255,0.16)] text-white font-semibold hover:border-blue-500 hover:text-blue-400 transition-colors"
          >
            Go to Settings
          </button>
        </div>
      </div>
    </div>
  );
}
