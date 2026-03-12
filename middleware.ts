import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const session = await auth();
    const { pathname } = request.nextUrl;

    const isLoggedIn = !!session;
    const isAdmin = session?.user?.role === "ADMIN";
    const isEmailVerified = !!(session?.user as any)?.emailVerified;

    // ── /dashboard — must be logged in and NOT admin ──────────────────────────
    if (pathname.startsWith("/dashboard")) {
        if (!isLoggedIn) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        // redirect admins away from user dashboard
        if (isAdmin) {
            return NextResponse.redirect(new URL("/admin", request.url));
        }

        return NextResponse.next();
    }

    // ── /admin — must be logged in AND ADMIN ──────────────────────────────────
    if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        if (!isAdmin) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        return NextResponse.next();
    }

    // ── /login, /register — redirect logged-in users away ─────────────────────
    if (pathname === "/login" || pathname === "/register") {
        if (isLoggedIn) {
            return NextResponse.redirect(
                new URL(isAdmin ? "/admin" : "/dashboard", request.url)
            );
        }

        return NextResponse.next();
    }

    // ── /verify-email — always public ─────────────────────────────────────────
    if (pathname.startsWith("/verify-email")) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*",
        "/login",
        "/register",
        "/verify-email/:path*",
    ],
};