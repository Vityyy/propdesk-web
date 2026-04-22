import { createBrowserRouter, redirect } from "react-router";
import { Layout } from "./Layout";
import { Summary } from "./pages/Summary";
import { Properties } from "./pages/Properties";
import { Tenants } from "./pages/Tenants";
import { Expenses } from "./pages/Expenses";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { SelectOwner } from "./pages/SelectOwner";
import authService from "../services/authService";

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
    path: "/select-owner",
    loader: () => {
      if (!authService.isSessionValidB()) {
        authService.clearToken();
        return redirect("/login");
      }

      const isAdmin = authService.getCurrentUserRole() === 'ADMIN';
      if (!isAdmin) {
        return redirect("/");
      }

      return null;
    },
    Component: SelectOwner,
  },
  {
    path: "/",
    loader: () => {
      if (!authService.isSessionValidB()) {
        authService.clearToken();
        return redirect("/login");
      }

      // If admin, redirect to owner selection
      const isAdmin = authService.getCurrentUserRole() === 'ADMIN';
      const hasSelectedOwner = sessionStorage.getItem('selectedOwnerId');
      if (isAdmin && !hasSelectedOwner) {
        return redirect("/select-owner");
      }

      return null;
    },
    Component: Layout,
    children: [
      { index: true, Component: Summary },
      { path: "properties", Component: Properties },
      { path: "apartments", loader: () => redirect("/properties") },
      { path: "tenants", Component: Tenants },
      { path: "expenses", Component: Expenses },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Settings },
    ],
  },
]);
