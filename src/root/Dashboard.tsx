import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/features/auth/authSlice";
import DashboardHeader from "../components/DashboardHeader";

export default function Dashboard() {
  const user = useAppSelector(selectCurrentUser);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 pt-24 pb-6">
        <Outlet />
      </main>
    </div>
  );
}
