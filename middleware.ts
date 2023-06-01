import { type NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/env.mjs";

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_KEY,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(
    env.UPSTASH_NUMBER_OF_REQUESTS,
    `${env.UPSTASH_REQUESTS_INTERVAL} s`
  ),
});

export default async function middleware(
  request: NextRequest
): Promise<Response | undefined> {
  console.log("middleware");
  const ip = request.ip ?? "127.0.0.1";
  console.log("ip", ip);
  console.log("upstash_url", env.UPSTASH_REDIS_REST_URL);
  const { success } = await ratelimit.limit(ip);
  return success
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/blocked", request.url));
}

export const config = {
  matcher: "/",
};
