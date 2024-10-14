import { NextRequest, NextResponse } from "next/server";
import { EnumTokens } from "./constants/auth";
import { cookies } from "next/headers";
import { AuthService } from "./services/auth.service";
import { apiUrl } from "./constants/paths";
import { matchPaths } from "@/utils/common";

const PROTECTED_ROUTES = ["/songs/*"];

const checkAuth = async (
  res: NextResponse
): Promise<{ isAuthenticated: boolean }> => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(EnumTokens.ACCESS_TOKEN)?.value;
  const refreshToken = cookieStore.get(EnumTokens.REFRESH_TOKEN)?.value;

  let isAuthenticated = false;

  if (accessToken) {
    try {
      const response = await fetch(`${apiUrl}/auth/current-user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        isAuthenticated = true;
      }
    } catch (e) {
      console.error("error", e);
    }
  }

  if (!isAuthenticated && refreshToken) {
    try {
      const refreshResponse = await fetch(`${apiUrl}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
        headers: {
          cookie: cookieStore.toString(),
        },
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        const setCookie = refreshResponse.headers.get("set-cookie") || "";

        AuthService.setAccessToken(data.accessToken, res);
        res.headers.append("Set-Cookie", setCookie);

        isAuthenticated = true;
      } else {
        res.cookies.delete(EnumTokens.REFRESH_TOKEN);
      }
    } catch (e) {
      console.error("error", e);
    }
  }

  return { isAuthenticated };
};

export async function middleware(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  const isAuthPage =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/registration";
  ``;
  const res = NextResponse.next();

  if (isAuthPage || matchPaths(request.nextUrl.pathname, PROTECTED_ROUTES)) {
    const auth = await checkAuth(res);

    if (isAuthPage && auth.isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url), {
        headers: res.headers,
      });
    } else if (!isAuthPage && !auth.isAuthenticated) {
      return NextResponse.redirect(loginUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!.*\\.).*)"],
};
