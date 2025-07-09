"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { userService } from "@/services/userService";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "parent", // or 'teacher'
  });
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await userService.register(
        form.email,
        form.password,
        form.role,
        form.firstName,
        form.lastName
      );
      if (form.role === "teacher") {
        router.push("/dashboard/teacher");
      } else {
        router.push("/dashboard/parent");
      }
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        setError(
          (err.response as { data: { message?: string } }).data.message ||
            "Registration failed"
        );
      } else if (err instanceof Error) {
        setError(err.message || "Registration failed");
      } else {
        setError("Registration failed");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
    >
      <h2 className="text-xl font-semibold">Sign Up</h2>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <input
        name="firstName"
        onChange={handleChange}
        placeholder="First Name"
        required
        className="w-full border p-2 rounded"
      />
      <input
        name="lastName"
        onChange={handleChange}
        placeholder="Last Name"
        required
        className="w-full border p-2 rounded"
      />
      <input
        name="email"
        onChange={handleChange}
        placeholder="Email"
        type="email"
        required
        className="w-full border p-2 rounded"
      />
      <input
        name="password"
        onChange={handleChange}
        placeholder="Password"
        type="password"
        required
        className="w-full border p-2 rounded"
      />

      <select
        name="role"
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="parent">Parent</option>
        <option value="teacher">Teacher</option>
      </select>

      <Button type="submit" variant="primary" fullWidth>
        Register
      </Button>
    </form>
  );
}
