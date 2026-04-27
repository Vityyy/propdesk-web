import React from "react";
import { createBrowserRouter, redirect } from "react-router";
import { Layout } from "./Layout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { RoleProtectedRoute } from "./components/RoleProtectedRoute";
import authService from "../services/authService";
import { 
  ROUTES_PERMISSIONS, 
  ROUTES_COMPONENTS, 
  ROUTES_FALLBACK,
  type RouteName 
} from "./RolePermissions";

const createProtectedRoute = (
  allowedRoles: readonly ('ADMIN' | 'OWNER')[],
  Component: React.ComponentType,
  fallbackPath?: string
) => {
  return () => React.createElement(
    RoleProtectedRoute,
    { allowedRoles: [...allowedRoles], fallbackPath, children: React.createElement(Component) }
  );
};

// Generar rutas desde la configuración
const generateRoutes = () => {
  return (Object.entries(ROUTES_PERMISSIONS) as [RouteName, readonly ('ADMIN' | 'OWNER')[]][])
    .map(([routeName, allowedRoles]) => {
      const Component = ROUTES_COMPONENTS[routeName];
      const fallbackPath = ROUTES_FALLBACK[routeName as keyof typeof ROUTES_FALLBACK];
      
      return {
        path: routeName,
        Component: createProtectedRoute(allowedRoles, Component, fallbackPath),
      };
    });
};


const homeLoader = () => {
  const userRole = authService.getCurrentUserRole();
  
  if (userRole === 'ADMIN') {
    return redirect("/summary");
  }
  
  return redirect("/properties");
};

export const router = createBrowserRouter([
  {
    path: "/login",
    loader: () => {
      if (authService.isSessionValidB()) {
        return redirect("/");
      }

      return null;
    },
    Component: Login,
  },
  {
    path: "/register",
    loader: () => {
      if (authService.isSessionValidB()) {
        return redirect("/");
      }

      return null;
    },
    Component: Register,
  },
  {
    path: "/",
    loader: () => {
      if (!authService.isSessionValidB()) {
        authService.clearToken();
        return redirect("/login");
      }

      return null;
    },
    Component: Layout,
    children: [
      { 
        index: true,
        loader: homeLoader,
      },
      { path: "apartments", loader: () => redirect("/properties") },
      // Generar todas las rutas
      ...generateRoutes(),
    ],
  },
]);
