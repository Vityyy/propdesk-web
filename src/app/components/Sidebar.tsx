import { Link, useLocation, useNavigate } from 'react-router';
import svgPaths from "../../imports/svg-zayt9vop9f";
import { OwnerSelector } from './OwnerSelector';
import { useAuth } from '../context/AuthContext';
import { useOwner } from '../context/OwnerContext';
import authService from '../../services/authService';
import { getAccessibleRoutes, type UserRole } from '../RolePermissions';

function Building() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="building">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="building">
          <path d={svgPaths.p3d3d1a18} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Tools() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="tools">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="tools">
          <path d={svgPaths.p3b4f65c0} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Clipboard() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="clipboard">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="clipboard">
          <path d={svgPaths.p4a80f00} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SettingsIcon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="settings">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_1_264)" id="settings">
          <g id="Icon">
            <path d={svgPaths.p3cccb600} stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p3737f500} stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_1_264">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ChartLine() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="chart-line">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="chart-line">
          <path d="M3 3V21H21" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M18 9L13 14L9 10L3 16" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Users() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="users">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="users">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function PieChart() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="pie-chart">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="pie-chart">
          <path d="M12 2V12H22C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M12 2C12 2 12 12 12 12" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

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
      className={`${isActive ? 'bg-[rgba(146,141,211,0.06)]' : 'bg-black hover:bg-[rgba(146,141,211,0.03)]'} relative rounded-[8px] shrink-0 w-full transition-colors`}
      data-name="menu item"
      title={isCollapsed ? label : undefined}
    >
      <div className="flex flex-row items-center size-full">
        <div className={`content-stretch flex gap-[16px] items-center px-[16px] py-[8px] relative w-full ${isCollapsed ? 'justify-center' : ''}`}>
          {icon}
          {!isCollapsed && (
            <p className={`font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] whitespace-nowrap ${isActive ? 'text-[#928dd3]' : 'text-white'}`} style={{ fontVariationSettings: "'wdth' 100" }}>
              {label}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

function LogoutIcon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="logout">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d="M15 17L20 12L15 7" stroke="#FF6B6B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="M20 12H9" stroke="#FF6B6B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#FF6B6B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </div>
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
    'summary': { label: 'Summary', icon: <ChartLine /> },
    'properties': { label: 'Properties', icon: <Building />, pathPrefix: '/properties' },
    'tenants': { label: 'Tenants info', icon: <Users />, pathPrefix: '/tenants' },
    'maintenanceFees': { label: 'Maintenance Fees', icon: <Tools />, pathPrefix: '/maintenance-fees' },
    'reports': { label: 'Reports', icon: <PieChart />, pathPrefix: '/reports' },
    'settings': { label: 'Settings', icon: <SettingsIcon />, pathPrefix: '/settings' },
  };

  return (
    <div className={`content-stretch flex flex-col isolate items-start overflow-clip relative shrink-0 transition-all duration-300 z-[2] ${isCollapsed ? 'w-[80px]' : 'w-[400px]'}`} data-name="Sidebar">
      <div className="bg-black content-stretch flex h-full flex-col items-start overflow-clip py-[24px] px-[24px] relative shrink-0 w-full z-[1]" data-name="Side Panel Menu">
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
            className="ml-auto hover:bg-[rgba(255,255,255,0.05)] transition-colors p-[8px] rounded-[8px]"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="size-[24px]" fill="none" viewBox="0 0 24 24">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
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
          className="mt-auto bg-black hover:bg-[rgba(255,107,107,0.08)] relative rounded-[8px] shrink-0 w-full transition-colors"
          title={isCollapsed ? 'Logout' : undefined}
        >
          <div className={`content-stretch flex gap-[16px] items-center px-[16px] py-[8px] relative w-full ${isCollapsed ? 'justify-center' : ''}`}>
            <LogoutIcon />
            {!isCollapsed && (
              <p className="font-['Archivo:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[15px] whitespace-nowrap text-[#FF6B6B]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Logout
              </p>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}