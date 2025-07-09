// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    user: {
      name?: string;
      email?: string;
      role: string;
    };
  }

  interface User {
    id: string;
    email: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }
}
