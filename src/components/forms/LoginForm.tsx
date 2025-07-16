"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button"

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  const res = await signIn("credentials", {
    email: form.email,
    password: form.password,
    redirect: false,
  });

  if (res?.error) {
    setError("Invalid email or password");
    setLoading(false);
    return;
  }
  const session = await waitForSession();

  if (!session) {
    setError("Login failed. Please try again.");
    return;
  }

  const role = session.user?.role;
  if (role === "parent") {
    router.push("/dashboard/parent");
  } else if (role === "student") {
    router.push("/dashboard/student");
  } else if (role === "teacher") {
    router.push("/dashboard/teacher");
  } else {
    setError("Could not determine user role.");
  }

  setLoading(false);
};

const waitForSession = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    const session = await getSession();
    if (session?.user?.role) return session;
    await new Promise((res) => setTimeout(res, 300));
  }
  return null;
};



  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md max-w-md space-y-4">
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

      <Button type="submit" variant="primary" fullWidth disabled={loading}>
        {loading ? "Logging in..." : "Log In"}
      </Button>
    </form>
  )
}
