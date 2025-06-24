import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../redux/features/auth/authApi";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [forgotPassword] = useForgotPasswordMutation();

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    try {
      const res = await forgotPassword({ email: data.email }).unwrap();
      toast.success(res.message);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side with gradient and image */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-b from-[#040612] to-[#60E5AE]">
        <div className="absolute inset-0 backdrop-blur-[150px] z-0"></div>
        <div className="relative z-10 flex items-center justify-center w-full">
          <img
            src="/images/logo.png"
            alt="Illustration"
            className="max-w-[80%] max-h-[80%] object-contain"
          />
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-white">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Forgot Password?</h2>
            <p className="text-gray-500 mt-2">
              Enter your email to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter your email address"
                className="w-full p-3 rounded-[5px] border border-[#E1E1E1] bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.12)] focus:outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#60E5AE] hover:bg-[#4DD49C] text-white py-3 rounded-[5px] shadow-md font-medium ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Sending..." : "Reset Password"}
            </button>

            <div className="text-center text-sm mt-4">
              <Link
                to="/login"
                className="text-[#60E5AE] hover:underline font-medium"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
