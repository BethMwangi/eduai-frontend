"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // ✅ Redirect based on role
      if (data.user?.role === "teacher") {
        router.push("/dashboard/teacher");
      } else {
        router.push("/dashboard/parent");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
    >
      <h2 className="text-xl font-semibold">Login</h2>

      {error && <p className="text-red-500">{error}</p>}

      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        value={form.email}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        value={form.password}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <Button type="submit" variant="primary" fullWidth>
        Log In
      </Button>
        <p className="text-center text-sm text-gray-600">
        Not a member?{" "}
        <span
          onClick={() => router.push("/register")}
          className="text-red-500 hover:underline cursor-pointer font-medium"
        >
          Start a 14 day free trial
        </span>
      </p>
    </form>
  );
}
