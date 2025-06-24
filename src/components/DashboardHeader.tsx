import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Clock,
  List,
  RotateCcw,
  User,
  ChevronDown,
  LogOut,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { logout } from "../redux/features/auth/authSlice";
import { toast } from "sonner";
import { useGetSingleUserProfileQuery } from "../redux/features/user/userApi";

export default function DashboardHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // const user = useAppSelector(selectCurrentUser);
  // console.log(user);
  const { data: user } = useGetSingleUserProfileQuery(undefined);
  // console.log("current", user);

  const handleLogout = () => {
    dispatch(logout());
    console.log("Logging out...");
    setIsDropdownOpen(false);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? "bg-white bg-opacity-20 text-white"
      : "text-white hover:bg-white hover:bg-opacity-10";

  return (
    <div
      className="relative w-full"
      style={{
        height: "200px",
        background:
          "linear-gradient(-102deg, #60E5AE 3.72%, #60E5AE 3.72%, #040612 80.82%)",
        borderBottom: "1px solid #E4E4E4",
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 opacity-10 bg-no-repeat bg-right"
        style={{ backgroundImage: `url("/images/top-banner.png")` }}
      ></div>

      {/* TopBar */}
      <div className="flex items-center justify-between px-4 py-3 absolute top-0 left-0 right-0 z-10">
        {/* Left: Logo */}
        <Link
          to="/dashboard"
          className="flex items-center space-x-2 cursor-pointer"
        >
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-lg">Tasko</span>
        </Link>

        {/* Middle: Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/dashboard/tasks"
            className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${isActive(
              "/dashboard/tasks"
            )}`}
          >
            <List className="w-4 h-4" />
            <span>Task List</span>
          </Link>
          <Link
            to="/dashboard/spin"
            className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${isActive(
              "/dashboard/spin"
            )}`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Spin</span>
          </Link>
        </nav>

        {/* Right: User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 text-white focus:outline-none"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.data?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <span className="hidden sm:block text-sm font-medium">
              {user?.data?.name.toUpperCase() || "User"}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <div className="px-4 py-2 text-xs text-gray-500 border-b">
                Signed in as
                <div className="font-medium text-gray-900 truncate">
                  {user?.data?.email}
                </div>
              </div>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User className="w-4 h-4 mr-3" /> Profile
              </button>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings className="w-4 h-4 mr-3" /> Settings
              </button>
              <div className="border-t"></div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-3" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Welcome Text (Optional) */}
      <div className="absolute bottom-8 left-8 z-10">
        <h2 className="text-white text-lg opacity-90 mb-2">
          Hi {user?.data?.name.toUpperCase()}
        </h2>
        <h1 className="text-white text-3xl font-bold">Welcome to Dashboard</h1>
      </div>
    </div>
  );
}
