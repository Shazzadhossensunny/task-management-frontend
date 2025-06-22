import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

type FormData = {
  password: string;
  confirmPassword: string;
};

type FormErrors = {
  password?: string;
  confirmPassword?: string;
};

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: Replace with Redux Toolkit/RTK Query API call here:
      // await resetPasswordMutation({ email: "m32220@gmail.com", password: formData.password });

      console.log("Password Reset Data:", formData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Password reset successfully!");
    } catch (error) {
      console.error("Reset password error:", error);
      alert("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    // Future navigation handling (react-router)
    console.log("Navigate to login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner */}
      <div
        className="w-full relative"
        style={{
          height: "174px",
          background:
            "linear-gradient(-102deg, #60E5AE 3.72%, #60E5AE 3.72%, #040612 80.82%)",
          borderBottom: "1px solid #E4E4E4",
          backdropFilter: "blur(150px)", // blur was missing here
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
            "0px 1px 3px 0px rgba(0, 0, 0, 0.12), 0px 23px 44px 0px rgba(176, 183, 195, 0.14)",
          maxWidth: "500px",
        }}
      >
        {/* Lock Icon */}
        <div
          className="w-20 h-20 mx-auto flex items-center justify-center rounded-3xl bg-white mb-4"
          style={{
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
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

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Reset your Password
          </h1>
          <p className="text-gray-600 text-sm">
            Strong passwords include numbers, letters, and punctuation marks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div
              className="p-3 rounded-md border bg-gray-50 text-gray-700"
              style={{
                borderColor: "#E1E1E1",
                boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
              }}
            >
              m32220@gmail.com
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full p-3 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                style={{
                  borderColor: errors.password ? "#EF4444" : "#E1E1E1",
                  boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
                }}
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
                placeholder="Retype password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="w-full p-3 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                style={{
                  borderColor: errors.confirmPassword ? "#EF4444" : "#E1E1E1",
                  boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
                }}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-md text-white font-medium shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
            style={{
              background:
                "linear-gradient(102deg, #05E389 3.72%, #009A62 80.82%)",
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Resetting Password...
              </div>
            ) : (
              "Reset Password"
            )}
          </button>

          {/* Back to Login */}
          <div className="text-center pt-4">
            <Link to={"/login"}>
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-green-500 hover:text-green-600 font-medium hover:underline transition-colors duration-200"
              >
                Back to Login
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
