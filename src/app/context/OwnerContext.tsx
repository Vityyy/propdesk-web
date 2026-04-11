import { createContext, useContext, useState, ReactNode } from 'react';

interface Owner {
  id: string;
  name: string;
  properties: number;
  totalRevenue: string;
}

interface OwnerContextType {
  currentOwner: Owner;
  setCurrentOwner: (owner: Owner) => void;
  owners: Owner[];
}

const defaultOwners: Owner[] = [
  { id: '1', name: 'John Martinez', properties: 3, totalRevenue: '$105,000' },
  { id: '2', name: 'Sarah Johnson', properties: 2, totalRevenue: '$70,000' },
  { id: '3', name: 'Michael Chen', properties: 4, totalRevenue: '$143,000' },
  { id: '4', name: 'Emily Rodriguez', properties: 1, totalRevenue: '$28,000' },
];

const OwnerContext = createContext<OwnerContextType | undefined>(undefined);

export function OwnerProvider({ children }: { children: ReactNode }) {
  const [currentOwner, setCurrentOwner] = useState<Owner>(defaultOwners[0]);

  return (
    <OwnerContext.Provider value={{ currentOwner, setCurrentOwner, owners: defaultOwners }}>
      {children}
    </OwnerContext.Provider>
  );
}

export function useOwner() {
  const context = useContext(OwnerContext);
  if (context === undefined) {
    throw new Error('useOwner must be used within an OwnerProvider');
  }
  return context;
}
