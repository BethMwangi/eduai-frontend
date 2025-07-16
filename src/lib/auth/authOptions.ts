// src/lib/auth/authOptions.ts
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import axios from "axios";
import type { User } from "next-auth";
import TokenResponse  from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const TOKEN_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes



type CustomJWT = JWT & {
  id: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  full_name: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  error?: string;
};

async function refreshAccessToken(token: CustomJWT): Promise<CustomJWT> {
  try {
     const response = await axios.post<TokenResponse>(
      `${API_URL}/auth/token/refresh/`,
      { refresh: token.refreshToken },
      { headers: { "Content-Type": "application/json" } }
    );

    return {
      ...token,
      accessToken: response.data.access,
      ...(response.data.refresh && { refreshToken: response.data.refresh }),
      accessTokenExpires: Date.now() + TOKEN_EXPIRY_MS,
      error: undefined,
    };
  } catch (error) {
    console.error("Token refresh failed:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await axios.post(`${API_URL}/auth/login/`, {
            email: credentials.email,
            password: credentials.password,
          });

          const { access, refresh, user } = response.data;
          if (!access || !refresh || !user) return null;

        return {
            id: String(user.id),
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            full_name: user.full_name,
            accessToken: access,
            refreshToken: refresh,
          } as User;
        } catch (error) {
          console.error("Login failed:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: TOKEN_EXPIRY_MS / 1000,
  },

callbacks: {
    async jwt({ token, user, trigger }: { token: JWT; user?: User; trigger?: string }): Promise<JWT> {
      // Handle sign out
      if (trigger === "signOut") {
        return {
          ...token,
          accessToken: "",
          refreshToken: "",
          accessTokenExpires: 0,
          error: undefined,
        };
      }
      
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          role: user.role as string,
          first_name: user.first_name as string,
          last_name: user.last_name as string,
          full_name: user.full_name as string,
          accessToken: user.accessToken as string,
          refreshToken: user.refreshToken as string,
          accessTokenExpires: Date.now() + TOKEN_EXPIRY_MS,
        };
      }

      const customToken = token as CustomJWT;
      if (Date.now() < customToken.accessTokenExpires) return token;
      return await refreshAccessToken(customToken);
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      const customToken = token as CustomJWT;
      if (customToken.error === "RefreshAccessTokenError") {
        return {
          ...session,
          accessToken: "",
          refreshToken: "",
          error: "SessionExpired",
          user: undefined,
        };
      }

      return {
        ...session,
        accessToken: customToken.accessToken,
        refreshToken: customToken.refreshToken,
        error: undefined,
        user: {
          id: customToken.id,
          email: customToken.email,
          role: customToken.role,
          first_name: customToken.first_name,
          last_name: customToken.last_name,
          full_name: customToken.full_name,
        },
      };
    },
    
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }): Promise<string> {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },

  pages: {
    signIn: "/login",
  },

  events: {
    async signOut() {
      // optional backend logout
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
