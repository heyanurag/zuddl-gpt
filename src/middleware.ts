import { ratelimit } from "@/config";
import { type NextRequest, NextResponse } from "next/server";

export default async function middleware(
  request: NextRequest
): Promise<Response | undefined> {
  const ip = request.ip ?? "127.0.0.1";

  const { success } = await ratelimit.limit(ip);

  return success
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/blocked", request.url));
}

export const config = {
  matcher: "/",
};
