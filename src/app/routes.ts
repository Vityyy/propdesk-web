import { createBrowserRouter, redirect } from "react-router";
import { Layout } from "./Layout";
import { Summary } from "./pages/Summary";
import { Properties } from "./pages/Properties";
import { Apartments } from "./pages/Apartments";
import { Tenants } from "./pages/Tenants";
import { Expenses } from "./pages/Expenses";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
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
      { index: true, Component: Summary },
      { path: "properties", Component: Properties },
      { path: "properties/:propertyId/apartments", Component: Apartments },
      { path: "tenants", Component: Tenants },
      { path: "expenses", Component: Expenses },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Settings },
    ],
  },
]);
