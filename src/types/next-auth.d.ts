// types/next-auth.d.ts
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    error?: string;
    user: {
      id?: string;
      first_name?: string;
      last_name?: string;
      full_name?: string;
      email?: string;
      role: string;
    };
  }

  interface User {
    id: string
    email: string
    first_name?: string
    last_name?: string
    full_name?: string
    role: string
    accessToken: string
    refreshToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    email?:string
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
    role: string
    first_name?: string
    last_name?: string
    full_name?: string
    error?: string
  }
}