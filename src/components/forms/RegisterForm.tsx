"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { userService } from "@/services/userService";

interface RegisterErrorResponse {
  email?: string[];
  non_field_errors?: string[];
  [key: string]: unknown;
}

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      const destination =
        form.role === "teacher" ? "/dashboard/teacher" : "/dashboard/parent";
      router.push(destination);
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        (err as { response?: unknown }).response &&
        typeof (err as { response: unknown }).response === "object" &&
        "data" in (err as { response: { data?: unknown } }).response
      ) {
        const data = (err as {
          response: { data: RegisterErrorResponse };
        }).response.data;

        if (data.email && Array.isArray(data.email)) {
          setError(`Email: ${data.email[0]}`);
        } else if (data.non_field_errors) {
          setError(data.non_field_errors[0]);
        } else {
          setError("Registration failed. Please check your input.");
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
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
        type="email"
        placeholder="Email"
        required
        value={form.email}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        value={form.password}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <select
        name="role"
        value={form.role}
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
