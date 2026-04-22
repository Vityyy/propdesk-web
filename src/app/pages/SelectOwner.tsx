import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { useOwner } from '../context/OwnerContext';

export function SelectOwner() {
  const navigate = useNavigate();
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-white mb-4">Seleccionar Propietario</h1>
          <p className="text-red-400 text-lg mb-6">No tienes propietarios vinculados</p>
          <p className="text-gray-400">
            Los propietarios deben vincularte como administrador. Espera a que lo hagan en la sección de configuración.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-black border border-[rgba(255,255,255,0.16)] rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Seleccionar Propietario
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Elige el propietario que quieres gestionar
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
      </div>
    </div>
  );
}
