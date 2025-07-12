import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import axios from "axios";

interface CustomUser extends User {
  id: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  full_name: string;
  accessToken: string;
  refreshToken: string;
}

// Define a type instead of an interface to avoid extending JWT
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

async function refreshAccessToken(token: CustomJWT): Promise<JWT> {
  try {
    // Your refresh token logic here
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh/`,
      {
        refresh: token.refreshToken,
      }
    );

    if (response.status !== 200) {
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }

    return {
      ...token,
      accessToken: response.data.access,
      accessTokenExpires: Date.now() + 30 * 60 * 1000,
      error: undefined,
    };
  } catch (_error) {
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
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login/`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          const { access, refresh, user } = response.data;
          if (!access || !refresh || !user) return null;

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            full_name: user.full_name,
            accessToken: access,
            refreshToken: refresh,
          };
        } catch (error) {
          console.error("Login failed:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
  },
  events: {
    signOut() {
      // We'll handle token cleanup in the jwt callback
      return;
    },
  },
  callbacks: {
    async jwt({ token, user, session }): Promise<JWT> {
      // Handle signout (session will be null)
      if (session === null) {
        return {
          ...token,
          accessToken: "",
          refreshToken: "",
          accessTokenExpires: 0,
          error: undefined,
          role: "",
          id: "",
          email: "",
          first_name: "",
          last_name: "",
          full_name: "",
        };
      }

      // Initial sign in
      if (user) {
        const customUser = user as CustomUser;
        return {
          ...token,
          id: customUser.id,
          email: customUser.email,
          role: customUser.role,
          first_name: customUser.first_name,
          last_name: customUser.last_name,
          full_name: customUser.full_name,
          accessToken: customUser.accessToken,
          refreshToken: customUser.refreshToken,
          accessTokenExpires: Date.now() + 30 * 60 * 1000, // 30 minutes
          error: undefined,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to update it
      console.log("Access token expired, attempting refresh...");
      return await refreshAccessToken(token as CustomJWT);
    },
    async session({ session, token }) {
      // Don't set session data if token is invalidated
      if (!(token.accessToken as string) || (token.accessTokenExpires as number) <= 0) {
        return {
          ...session,
          user: {
            ...session.user,
            role: undefined,
            email: undefined,
            first_name: undefined,
            last_name: undefined,
            full_name: undefined,
          },
        };
      }

      return {
        ...session,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        error: token.error,
        user: {
          ...session.user,
          role: token.role,
          email: token.email,
          first_name: token.first_name as string,
          last_name: token.last_name as string,
          full_name: token.full_name as string,
        },
      };
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
