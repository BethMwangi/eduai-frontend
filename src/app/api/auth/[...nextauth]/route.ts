// /app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
import { authOptions } from "@/lib/auth/authOptions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
