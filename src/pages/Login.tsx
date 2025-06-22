import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../redux/features/auth/authApi";
import { verifyToken } from "../utils/verifyToken";
import type { TUser } from "../type/global.type";
import { useAppDispatch } from "../redux/hooks";
import { setUser } from "../redux/features/auth/authSlice";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const userInfo = {
      email: data.email,
      password: data.password,
    };
    try {
      const result = await login(userInfo).unwrap();
      const { userId, email, role } = verifyToken(
        result.data.accessToken
      ) as TUser;
      const user = { userId, role };

      dispatch(setUser({ user, email, token: result.data.accessToken }));
      toast.success("Logged in successfully!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Something went wrong!");
    }
    reset();
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
          <h2 className="text-3xl font-bold text-center">Login</h2>
          <p className="text-center text-gray-500">
            Welcome back! Please enter your details.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="**********"
                className="w-full p-3 rounded-[5px] border border-[#E1E1E1] bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.12)] focus:outline-none"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-[#60E5AE] border-gray-300 rounded"
                />
                <span>Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-[#60E5AE] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#60E5AE] hover:bg-[#4DD49C] text-white py-3 rounded-[5px] shadow-md font-medium"
            >
              Log In
            </button>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-4 text-gray-400">Or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <p className="text-center text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#60E5AE] hover:underline font-medium"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
