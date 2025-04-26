// next-auth.d.ts
import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    name?: string;
    username?: string;
    email?: string;
    profile_img?: string;
    isVerified?: boolean;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
    exp?: number;
    iat?: number;
    jti?: string;
    sub?: string;
  }
  interface Session {
    user: {
      id?: string;
      name?: string;
      username?: string;
      email?: string;
      profile_img?: string;
      isVerified?: boolean;
      role?: string;
      accessToken?: string;
      refreshToken?: string;
      accessTokenExpires?: number;
      error?: string;
      exp?: number;
      iat?: number;
      jti?: string;
      sub?: string;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    username?: string;
    email?: string;
    profile_img?: string;
    isVerified?: boolean;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
    exp?: number;
    iat?: number;
    jti?: string;
    sub?: string;

    // accessToken: string;
    // refreshToken: string;
    // refreshTokenExpiresAt: number;
  }
}
