import { Link, useLocation, useNavigate } from 'react-router';
import { LineChart, Building2, Users as UsersIcon, Wrench, PieChart, Settings as SettingsIcon, LogOut, Menu } from 'lucide-react';
import { OwnerSelector } from './OwnerSelector';
import { useAuth } from '../context/AuthContext';
import { useOwner } from '../context/OwnerContext';
import authService from '../../services/authService';
import { getAccessibleRoutes, type UserRole } from '../RolePermissions';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive: boolean;
  isCollapsed?: boolean;
}

function MenuItem({ icon, label, to, isActive, isCollapsed }: MenuItemProps) {
  return (
    <Link 
      to={to}
      className={`group relative rounded-[12px] shrink-0 w-full mb-1 transition-all duration-300 overflow-hidden ${
        isActive 
          ? 'bg-[#928dd3]/15 shadow-[inset_4px_0_0_0_#928dd3]' 
          : 'bg-transparent hover:bg-white/[0.04]'
      }`}
      title={isCollapsed ? label : undefined}
    >
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#928dd3]/10 to-transparent" />
      )}
      {!isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#928dd3]/0 to-transparent group-hover:from-[#928dd3]/5 transition-all duration-300" />
      )}
      <div className={`flex items-center px-4 py-3 relative z-10 ${isCollapsed ? 'justify-center' : 'gap-4'}`}>
        <div className={`transition-all duration-300 ${isActive ? 'text-[#928dd3]' : 'text-white/40 group-hover:text-[#928dd3] group-hover:scale-110'}`}>
          {icon}
        </div>
        {!isCollapsed && (
          <p className={`font-['Archivo:SemiBold',sans-serif] font-semibold text-[15px] whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-[#928dd3]' : 'text-white/60 group-hover:text-white'}`}>
            {label}
          </p>
        )}
      </div>
    </Link>
  );
}

export function Sidebar({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { currentOwner } = useOwner();
  const userRole = authService.getCurrentUserRole() as UserRole | null;
  const accessibleRoutes = userRole ? getAccessibleRoutes(userRole) : [];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Mapeo de rutas a etiquetas e iconos
  const routeConfig: { [key: string]: { label: string; icon: React.ReactNode; pathPrefix?: string } } = {
    'summary': { label: 'Summary', icon: <LineChart size={20} /> },
    'properties': { label: 'Properties', icon: <Building2 size={20} />, pathPrefix: '/properties' },
    'tenants': { label: 'Tenants info', icon: <UsersIcon size={20} />, pathPrefix: '/tenants' },
    'maintenance-fees': { label: 'Maintenance Fees', icon: <Wrench size={20} />, pathPrefix: '/maintenance-fees' },
    'reports': { label: 'Reports', icon: <PieChart size={20} />, pathPrefix: '/reports' },
    'settings': { label: 'Settings', icon: <SettingsIcon size={20} />, pathPrefix: '/settings' },
  };

  return (
    <div className={`content-stretch flex flex-col isolate items-start overflow-clip relative shrink-0 transition-all duration-300 z-[2] ${isCollapsed ? 'w-[80px]' : 'w-[400px]'}`} data-name="Sidebar">
      <div className="bg-[#030308]/80 backdrop-blur-xl border-r border-white/[0.04] content-stretch flex h-full flex-col items-start overflow-clip py-[24px] px-[24px] relative shrink-0 w-full z-[1]" data-name="Side Panel Menu">
        <div className="flex items-center w-full mb-[16px]">
          {!isCollapsed && userRole === 'ADMIN' && <OwnerSelector />}
          {!isCollapsed && userRole === 'OWNER' && (
            <p
              className="font-['Archivo:Medium',sans-serif] font-medium leading-[20px] text-[14px] text-[rgba(255,255,255,0.65)] truncate max-w-[260px]"
              style={{ fontVariationSettings: "'wdth' 100" }}
              title={currentOwner.name}
            >
              Owner: {currentOwner.name}
            </p>
          )}
          <button
            onClick={onToggle}
            className="ml-auto text-white/50 hover:text-white hover:bg-white/10 transition-colors p-[8px] rounded-[8px]"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu size={20} />
          </button>
        </div>
        {accessibleRoutes.map((route) => {
          const config = routeConfig[route];
          if (!config) return null;

          const isActive = route === 'summary' 
            ? location.pathname === '/summary' || location.pathname === '/'
            : location.pathname.startsWith(config.pathPrefix || `/${route}`);

          return (
            <MenuItem
              key={route}
              icon={config.icon}
              label={config.label}
              to={`/${route}`}
              isActive={isActive}
              isCollapsed={isCollapsed}
            />
          );
        })}
        <button
          type="button"
          onClick={handleLogout}
          className="group mt-auto bg-transparent hover:bg-[#ff6b6b]/10 relative rounded-[12px] shrink-0 w-full transition-all duration-300"
          title={isCollapsed ? 'Logout' : undefined}
        >
          <div className={`flex items-center px-4 py-3 relative z-10 ${isCollapsed ? 'justify-center' : 'gap-4'}`}>
            <div className="text-[#ff6b6b]/60 group-hover:text-[#ff6b6b] transition-all duration-300 group-hover:scale-110">
              <LogOut size={20} />
            </div>
            {!isCollapsed && (
              <p className="font-['Archivo:SemiBold',sans-serif] font-semibold text-[15px] whitespace-nowrap text-[#ff6b6b]/80 group-hover:text-[#ff6b6b] transition-colors duration-300">
                Logout
              </p>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}