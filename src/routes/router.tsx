import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../root/Dashboard";
import DashboardHome from "../pages/dashboard/DashboardHome";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      // Add more dashboard routes here as needed
      // {
      //   path: "tasks",
      //   element: <Tasks />,
      // },
      // {
      //   path: "profile",
      //   element: <Profile />,
      // },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
