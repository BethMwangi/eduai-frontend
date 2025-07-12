"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/common/Button"

export default function LoginForm() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (res?.error) {
        setError("Invalid email or password")
      } else {
        const role = await fetchUserRole()
        console.log("User role after login:", role)
        
        if (role === "teacher") {
          router.push("/dashboard/teacher")
        } else if (role === "student") {
          router.push("/dashboard/student")
        } else if (role === "parent") {
          router.push("/dashboard/parent")
        } else {
          setError("Unable to determine user role. Please try again.")
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function fetchUserRole(): Promise<string | null> {
    try {
      const res = await fetch("/api/auth/session")
      const session = await res.json()
      return session?.user?.role ?? null
    } catch {
      return null
    }
  }

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
