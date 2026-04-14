import { RouterProvider } from 'react-router';
import { router } from './routes';
import { OwnerProvider } from './context/OwnerContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppRouter() {
  const { isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="bg-black flex h-screen w-screen items-center justify-center">
        <p className="font-['Archivo:SemiBold',sans-serif] text-[15px] text-white">Cargando sesion...</p>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AuthProvider>
      <OwnerProvider>
        <AppRouter />
      </OwnerProvider>
    </AuthProvider>
  );
}