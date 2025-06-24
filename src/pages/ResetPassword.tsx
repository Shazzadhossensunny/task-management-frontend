import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useResetPasswordMutation } from "../redux/features/auth/authApi";
import { toast } from "sonner";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [resetPassword] = useResetPasswordMutation();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token and email from URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token") || "";

  // Validate form
  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "At least 6 characters required";

    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm password required";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) return;

    try {
      // Call reset password API
      await resetPassword({
        newPassword: password,
        token,
      }).unwrap();

      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error?.data?.message || "Password reset failed");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner */}
      <div
        className="w-full relative"
        style={{
          height: "174px",
          background: "linear-gradient(-102deg, #60E5AE 3.72%, #040612 80.82%)",
          borderBottom: "1px solid #E4E4E4",
          backdropFilter: "blur(150px)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="w-full h-full opacity-10"
            style={{
              backgroundImage: `url("/images/top-banner.png")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right",
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div
        className="container bg-white p-8 mx-auto mt-[-40px] relative z-10"
        style={{
          borderRadius: "15px",
          boxShadow:
            "0px 1px 3px rgba(0,0,0,0.12), 0px 23px 44px rgba(176,183,195,0.14)",
          maxWidth: "500px",
        }}
      >
        <div
          className="w-20 h-20 mx-auto flex items-center justify-center rounded-3xl bg-white mb-4"
          style={{
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <div
            className="w-full h-full flex items-center justify-center rounded-2xl"
            style={{
              background:
                "linear-gradient(102deg, #05E389 3.72%, #009A62 80.82%)",
            }}
          >
            <Lock className="text-white" size={32} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Reset your Password
          </h1>
          <p className="text-gray-600 text-sm">
            Enter a strong password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full p-3 rounded-md border bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full p-3 rounded-md border bg-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-md text-white font-medium bg-green-500 hover:bg-green-600"
          >
            Reset Password
          </button>
        </form>

        <div className="text-center pt-4">
          <Link to="/login" className="text-green-500 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
