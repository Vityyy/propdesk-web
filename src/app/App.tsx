import { RouterProvider } from 'react-router';
import { router } from './routes';
import { OwnerProvider } from './context/OwnerContext';

export default function App() {
  return (
    <OwnerProvider>
      <RouterProvider router={router} />
    </OwnerProvider>
  );
}