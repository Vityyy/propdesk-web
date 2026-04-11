import { createBrowserRouter } from "react-router";
import { Layout } from "./Layout";
import { Summary } from "./pages/Summary";
import { Properties } from "./pages/Properties";
import { Tenants } from "./pages/Tenants";
import { Expenses } from "./pages/Expenses";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Summary },
      { path: "properties", Component: Properties },
      { path: "tenants", Component: Tenants },
      { path: "expenses", Component: Expenses },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Settings },
    ],
  },
]);