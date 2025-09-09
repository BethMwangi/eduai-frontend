// src/context/auth.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import type {
  User,
  AuthContextType,
  LoginResponse,
  JwtPayload,
} from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

function mapJwtToUser(payload: JwtPayload): User | null {
  if (!payload.email || !payload.role) return null;
  const first_name = payload.first_name || "";
  const last_name = payload.last_name || "";
  const full_name =
    payload.full_name || `${first_name} ${last_name}`.trim() || undefined;
  return {
    id: payload.user_id ?? "",
    email: payload.email,
    role: payload.role,
    first_name,
    last_name,
    full_name,
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const decodeAccess = (token: string) => {
    try {
      const payload = jwtDecode<JwtPayload>(token);
      if (payload.exp) setTokenExpiry(payload.exp * 1000);
      const mapped = mapJwtToUser(payload);
      if (mapped) setUser(mapped);
    } catch (e) {
      console.warn("Failed to decode access token", e);
      setUser(null);
      setTokenExpiry(null);
    }
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    if (!refreshToken) {
      setAccessToken(null);
      setUser(null);
      setTokenExpiry(null);
      return null;
    }
    try {
      const res = await fetch(`${API_URL}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (!res.ok) {
        throw new Error("refresh failed");
      }
      const data: { access: string; refresh?: string } = await res.json();
      setAccessToken(data.access);
      if (data.refresh) setRefreshToken(data.refresh);
      decodeAccess(data.access);
      return data.access;
    } catch {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      setTokenExpiry(null);
      return null;
    }
  };

  const getValidAccessToken = async (): Promise<string | null> => {
    if (!accessToken) return await refreshAccessToken();
    if (tokenExpiry && Date.now() >= tokenExpiry - 5000) {
      return await refreshAccessToken();
    }
    return accessToken;
  };

  useEffect(() => {
    const access = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");
    if (access && refresh) {
      setAccessToken(access);
      setRefreshToken(refresh);
      decodeAccess(access);
    }
    setLoading(false);
  }, []);
  const login: AuthContextType["login"] = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          (err as { detail?: string; error?: string }).detail ||
            (err as { detail?: string; error?: string }).error ||
            "Login failed"
        );
      }
      const data: LoginResponse = await res.json();
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      if (data.user) {
        setUser(data.user);
      } else {
        decodeAccess(data.access);
      }
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register: AuthContextType["register"] = async (opts) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: opts.email,
          password: opts.password,
          role: opts.role,
          first_name: opts.first_name,
          last_name: opts.last_name,
        }),
      });
      if (!res.ok) {
        const err: { detail?: string; error?: string } = await res
          .json()
          .catch(() => ({}));
        throw new Error(err.detail || err.error || "Register failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // optionally tell backend to blacklist refresh token
    if (refreshToken) {
      await fetch(`${API_URL}/auth/logout/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      }).catch(() => {});
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setTokenExpiry(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        loading,
        login,
        register,
        logout,
        getValidAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
