import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

const roleBaseAccess = {
  user: ["/channeling"],
  admin: ["/channeling", "/dashboard"],
  doctor: [
    "/channeling",
    "/dashboard/appointment-list",
    "/dashboard/appointment-schedule",
    "/dashboard/treatment-history-management",
  ],
  supplier: ["/channeling", "/dashboard"],
};

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const path = url.pathname;
  const token = await getToken({ req: request });
  const newRoutes = Object.values(roleBaseAccess).flat();
  const newSet = new Set([...newRoutes]);
  const protectedRoutes = Array.from(newSet);

  // Redirect root to home page
  if (path === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // If user is already logged-in and trying to access auth pages, redirect based on role
  if (
    token &&
    (path.startsWith("/sign-in") ||
      path.startsWith("/sign-up") ||
      path.startsWith("/verify"))
  ) {
    if (token.role === "user") {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    if (token.role === "doctor") {
      return NextResponse.redirect(
        new URL("/dashboard/appointment-list", request.url)
      );
    }
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // If a user tries to access a protected route
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    // If user is not logged-in then go to sign-in
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const role = token.role as string;

    const allowedRoutes =
      roleBaseAccess[role as keyof typeof roleBaseAccess] || [];

    // Check if the current path is allowed for the user's role
    const isAllowed = allowedRoutes.some((route) => path.startsWith(route));

    if (!isAllowed) {
      // Redirect to sign-in if the user is not allowed to access the route
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
