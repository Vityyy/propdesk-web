import { Summary } from "./pages/Summary";
import { Properties } from "./pages/Properties";
import { Tenants } from "./pages/Tenants";
import { MaintenanceFees } from "./pages/MaintenanceFees";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import {Apartments} from "./pages/Apartments.tsx";

/**
 * Matriz de permisos: define qué roles pueden acceder a cada ruta
*/
export const ROUTES_PERMISSIONS = {
  summary: ['ADMIN', 'OWNER'] as const,
  properties: ['ADMIN', 'OWNER'] as const,
  "properties/:propertyId/apartments": ['ADMIN', 'OWNER'] as const,
  tenants: ['ADMIN'] as const,
  "maintenance-fees": ['ADMIN'] as const,
  reports: ['ADMIN'] as const,
  settings: ['ADMIN', 'OWNER'] as const,
} as const;

/**
 * Mapa de rutas a componentes
 */
export const ROUTES_COMPONENTS = {
  summary: Summary,
  properties: Properties,
  "properties/:propertyId/apartments": Apartments,
  tenants: Tenants,
  "maintenance-fees": MaintenanceFees,
  reports: Reports,
  settings: Settings,
} as const;

/**
 * Configuración de redireccion si no se tienen permisos
 * Si una ruta no tiene un fallback definido, se redirigirá a "/"
 */
export const ROUTES_FALLBACK = {
} as const;

export type RouteName = keyof typeof ROUTES_PERMISSIONS;

export type UserRole = 'ADMIN' | 'OWNER';

export const canRoleAccessRoute = (role: UserRole, route: RouteName): boolean => {
  const allowedRoles = ROUTES_PERMISSIONS[route];
  return allowedRoles.includes(role as never);
};

/**
 * se obtienen todas las rutas accesibles para un rol
 */
export const getAccessibleRoutes = (role: UserRole): RouteName[] => {
  return (Object.entries(ROUTES_PERMISSIONS) as [RouteName, readonly UserRole[]][])
    .filter(([, roles]) => roles.includes(role))
    .map(([route]) => route);
};
