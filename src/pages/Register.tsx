import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { toast } from "sonner";
import { useRegisterUserMutation } from "../redux/features/user/userApi";

const signupSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormInputs = z.infer<typeof signupSchema>;

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerUser] = useRegisterUserMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormInputs) => {
    // handle signup here
    const userInfo = {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };
    try {
      const result = await registerUser(userInfo).unwrap();
      if (result.error) {
        toast.error(result.message);
      } else {
        toast.success("User registration successfully!");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
    reset();
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="min-h-screen flex">
      {/* Left side with gradient and image */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-b from-[#040612] to-[#60E5AE]">
        <div className="absolute inset-0 backdrop-blur-[150px] z-0"></div>
        <div className="relative z-10 flex items-center justify-center w-full">
          <img
            src="/images/register.png"
            alt="Register Illustration"
            className="max-w-[80%] max-h-[80%] object-contain"
          />
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-white">
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-3xl font-bold text-center">Sign Up</h2>
          <p className="text-center text-gray-500">
            To Create Account, Please Fill in the Form Below.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                placeholder="Enter your full name"
                className="w-full p-3 rounded-[5px] border border-[#E1E1E1] bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.12)] focus:outline-none"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="**********"
                  className="w-full p-3 rounded-[5px] border border-[#E1E1E1] bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.12)] focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Retype password"
                  className="w-full p-3 rounded-[5px] border border-[#E1E1E1] bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.12)] focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#60E5AE] hover:bg-[#4DD49C] text-white py-3 rounded-[5px] shadow-md font-medium"
            >
              Sign Up
            </button>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-4 text-gray-400">Or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#60E5AE] hover:underline font-medium"
              >
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
