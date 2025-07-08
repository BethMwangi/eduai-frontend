"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "parent", // or 'teacher'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call your backend API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        if (form.role === "teacher") {
          router.push("/dashboard/teacher");
        } else {
          router.push("/dashboard/parent");
        }
      }
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
    >
      <h2 className="text-xl font-semibold">Sign Up</h2>

      <input name="firstName" onChange={handleChange} placeholder="First Name" required className="w-full border p-2 rounded" />
      <input name="lastName" onChange={handleChange} placeholder="Last Name" required className="w-full border p-2 rounded" />
      <input name="email" onChange={handleChange} placeholder="Email" type="email" required className="w-full border p-2 rounded" />
      <input name="password" onChange={handleChange} placeholder="Password" type="password" required className="w-full border p-2 rounded" />

      <select name="role" onChange={handleChange} className="w-full border p-2 rounded">
        <option value="parent">Parent</option>
        <option value="teacher">Teacher</option>
      </select>

      <Button type="submit" variant="primary" fullWidth>Register</Button>
    </form>
  );
}
