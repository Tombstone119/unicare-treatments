import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserApiResponse } from "@/types/users";
import { apiService } from "@/libs/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await apiService.post<UserApiResponse>(
            `/users/profile/sign-in`,
            {
              identifier: credentials.identifier,
              password: credentials.password,
            }
          );

          if (response.success === false) {
            throw new Error(response.message);
          }

          const user = response.user;

          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account before logging in");
          }
          return user;
        } catch (err) {
          if (err instanceof Error) {
            throw new Error(err.message);
          } else {
            throw new Error(String(err));
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isVerified = user.isVerified;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id || "",
          isVerified: !!token.isVerified,
          username: token.username || "",
          role: token.role || "user",
        };
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
});
