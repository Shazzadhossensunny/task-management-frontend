import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../root/Dashboard";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Tasks from "../pages/dashboard/task/Tasks";
import TaskDetailPage from "../pages/dashboard/task/TaskDetails";
import SpinWheel from "../pages/dashboard/spin/SpinWhel";
import NotFoundPage from "../pages/NotFound";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { USER_ROLE } from "../constants/user";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/dashboard",

    element: (
      <ProtectedRoute role={[USER_ROLE.user]}>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "tasks",
        element: (
          <ProtectedRoute role={[USER_ROLE.user]}>
            <Tasks />
          </ProtectedRoute>
        ),
      },
      {
        path: "tasks/:id",
        element: (
          <ProtectedRoute role={[USER_ROLE.user]}>
            <TaskDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "spin",
        element: (
          <ProtectedRoute role={[USER_ROLE.user]}>
            <SpinWheel />
          </ProtectedRoute>
        ),
      },
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
  {
    path: "/auth/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
