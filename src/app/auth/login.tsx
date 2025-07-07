import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { userService } from "@/services/userService";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await userService.login(email, password);

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 shadow rounded bg-white">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">
          EduAI Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </main>
  );
}
