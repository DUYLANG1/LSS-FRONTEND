import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { validateUser } from "@/lib/auth";
import { UserRole } from "@/utils/permissions";

// Extend the User type to include our custom properties
declare module "next-auth" {
  interface User {
    id: string;
    email?: string | null;
    name?: string;
    role: UserRole;
    accessToken?: string;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string;
      role: UserRole;
    };
    accessToken?: string;
  }

  interface JWT {
    id: string;
    email?: string | null;
    role: UserRole;
    accessToken?: string;
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
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password required");
          }
          const user = await validateUser(
            credentials.email,
            credentials.password
          );

          if (!user) {
            throw new Error("Invalid credentials");
          }

          // Return standardized user object
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            accessToken: user.accessToken,
          };
        } catch (error) {
          console.error("NextAuth authorize error:", error);
          // Return null instead of re-throwing to prevent NextAuth from showing error page
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user properties to the token right after signin
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }

      // Add access token to the session
      session.accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
