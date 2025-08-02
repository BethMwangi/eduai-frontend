"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { userService } from "@/services/userService";
import { useAuth } from "@/context/auth";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { UserRole } from "@/types/auth";

interface RegisterErrorResponse {
  email?: string[];
  password?: string[];
  first_name?: string[];
  last_name?: string[];
  role?: UserRole;
  non_field_errors?: string[];
  detail?: string;
  error?: string;
  [key: string]: unknown;
}
export default function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "parent", // or 'teacher'
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First name and last name are required");
      setLoading(false);
      return;
    }

    try {
      console.log("🔄 Starting registration process...");
      
      // Step 1: Register the user
      const registerResult = await userService.register(
        form.email,
        form.password,
        form.role,
        form.firstName,
        form.lastName
      );
      
      console.log("✅ Registration successful:", registerResult);

      // Step 2: Automatically log them in after successful registration
      console.log("🔄 Auto-logging in after registration...");
      const user = await login(form.email, form.password);
      
      console.log("✅ Auto-login successful:", user);

      // Step 3: Redirect based on role
      const destination = getRedirectDestination(user.role);
      console.log("🔄 Redirecting to:", destination);
      
      router.push(destination);
      
    } catch (err: unknown) {
      console.error("❌ Registration error:", err);
      
      let message = "Registration failed. Please check your input.";
      
      if (err instanceof Error) {
        const anyErr = err as Error & { data?: RegisterErrorResponse };
        
        if (anyErr.data && typeof anyErr.data === "object") {
          const data = anyErr.data;
          
          // Handle field-specific errors
          if (data.email && Array.isArray(data.email)) {
            message = `Email: ${data.email[0]}`;
          } else if (data.password && Array.isArray(data.password)) {
            message = `Password: ${data.password[0]}`;
          } else if (data.first_name && Array.isArray(data.first_name)) {
            message = `First name: ${data.first_name[0]}`;
          } else if (data.last_name && Array.isArray(data.last_name)) {
            message = `Last name: ${data.last_name[0]}`;
          } else if (data.role && Array.isArray(data.role)) {
            message = `Role: ${data.role[0]}`;
          } else if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
            message = data.non_field_errors[0];
          } else if (data.detail) {
            message = data.detail;
          } else if (data.error) {
            message = data.error;
          }
        } else if (anyErr.message) {
          message = anyErr.message;
        }
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

    const getRedirectDestination = (role: string) => {
    switch (role) {
      case "teacher":
        return "/dashboard/teacher";
      case "parent":
        return "/dashboard/parent";
      case "student":
        return "/dashboard/student";
      default:
        return "/dashboard";
    }
  };

  // const handleGoogleSignup = () => {
  //   // Implement Google sign-in logic
  //   userService.loginWithGoogle();
  // };
  return (
    <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-lg shadow-lg">
      {/* Logo and Welcome Text */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="StudyPool Logo"
              width={40}
              height={40}
              className="mr-2"
            />
            <div className="flex items-center">
              <span className="font-bold text-[#182b5c] text-2xl">STUDY</span>
              <span className="font-bold text-[#ff914d] text-2xl">pool</span>
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create Account
        </h1>
        <p className="text-gray-600">
          Join our platform today
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
          {error}
        </div>
      )}

    <form
      onSubmit={handleSubmit}
      className=" space-y-6"
    >
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={form.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#182b5c] focus:border-transparent transition"
              placeholder="Enter your first name"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={form.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#182b5c] focus:border-transparent transition"
              placeholder="Enter your last name"
            />
          </div>
        </div>


         <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#182b5c] focus:border-transparent transition"
            placeholder="Enter your email"
          />
        </div>


   <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#182b5c] focus:border-transparent transition appearance-none bg-white"
          >
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>


        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#182b5c] focus:border-transparent transition pr-10"
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#182b5c] focus:border-transparent transition pr-10"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
          className="py-3"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>

        {/* OR Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Google Sign In Button */}
        {/* <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-medium transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign up with Google
        </button> */}
      </form>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-[#182b5c] hover:text-[#ff914d] font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}