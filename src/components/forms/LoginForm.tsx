"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/context/auth";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
    if (user) {
      // redirect if already logged in
      console.log("User is already logged in, redirecting...");
      console.log("User details:", user);
      const role = user.role;
      if (role === "parent") router.push("/dashboard/parent");
      else if (role === "student") router.push("/dashboard/student");
      else if (role === "teacher") router.push("/dashboard/teacher");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

  try {
    const loggedInUser = await login(form.email, form.password);
    if (!loggedInUser?.role) {
      setError("Could not determine user role.");
      return;
    }
    // immediate redirect based on role
    if (loggedInUser.role === "parent") router.push("/dashboard/parent");
    else if (loggedInUser.role === "student") router.push("/dashboard/student");
    else if (loggedInUser.role === "teacher") router.push("/dashboard/teacher");
    else router.push("/");
  } catch (err: unknown) {
    if (err instanceof Error) setError(err.message || "Login failed");
    else setError("Login failed");
  } finally {
    setSubmitting(false);
  }
};

const handleGoogleLogin = () => {
  // Redirect to backend to initiate Google OAuth flow
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login/`;
};


  return (
    <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
      {/* Logo and Welcome Text */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="StudyPool Logo"
              width={50}
              height={50}
              className="mr-2"
            />
            <div className="flex items-center">
              <span className="font-bold text-[#182b5c] text-2xl">STUDY</span>
              <span className="font-bold text-[#ff914d] text-2xl">pool</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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

        {/* Password Field with Show/Hide Toggle */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#182b5c] focus:border-transparent transition pr-10"
              placeholder="Enter your password"
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

        {/* Forgot Password Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/forgot-password"
            className="text-sm text-[#182b5c] hover:text-[#ff914d] font-medium"
          >
            Forgot your password?
          </Link>
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={submitting}>
          {submitting ? "Logging in..." : "Log In"}
        </Button>

        {/* OR Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-medium transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>
      </form>
      <div className="text-center">
        <p className="text-gray-600">
          Don&#39;t have an account?{" "}
          <Link
            href="/register"
            className="text-[#182b5c] hover:text-[#ff914d] font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
