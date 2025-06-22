import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { selectCurrentUser, logout } from "../redux/features/auth/authSlice";
import { ChevronDown, LogOut, User, Settings } from "lucide-react";

const DashboardHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">TaskManager</h1>
            </div>
          </div>

          {/* Center - Task List Title */}
          <div className="hidden md:block">
            <h2 className="text-lg font-medium text-gray-700">
              Task Management
            </h2>
          </div>

          {/* Right side - Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-3 py-2"
              >
                {/* Profile Image */}
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>

                {/* User Name */}
                <span className="hidden sm:block text-sm font-medium">
                  {user?.name || "User"}
                </span>

                {/* Dropdown Arrow */}
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                    Signed in as
                    <div className="font-medium text-gray-900 truncate">
                      {user?.email}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </button>

                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>

                  <div className="border-t border-gray-100"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default DashboardHeader;
