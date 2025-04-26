import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { GetTokenResponse, UserApiResponse } from "@/types/users";
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
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 3600 * 1000; // (1 hour)
      }
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to refresh it
      try {
        const refreshed = await apiService.post<GetTokenResponse>(
          `/users/refreshToken`,
          {
            refreshToken: token.refreshToken,
          }
        );
        if (!refreshed.success) {
          throw new Error("RefreshAccessTokenError");
        }
        return {
          ...token,
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken || token.refreshToken, // Use new refresh token if provided
          accessTokenExpires: Date.now() + 3600 * 1000, // Update expiry time
        };
      } catch (error) {
        console.error("Error refreshing access token", error);
        // The error property will be used to trigger a sign out in the client
        return { ...token, error: "RefreshAccessTokenError" };
      }
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id || "",
          isVerified: !!token.isVerified,
          username: token.username || "",
          role: token.role || "user",
          accessToken: token.accessToken || "",
          refreshToken: token.refreshToken || "",
          exp: token.exp,
          iat: token.iat,
          jti: token.jti,
          sub: token.sub,
          ...(token.error && { error: token.error }),
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
