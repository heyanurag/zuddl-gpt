import { ratelimit } from "@/config";
import { NextResponse, type NextRequest } from "next/server";

const getIP = (request: NextRequest) => {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("cf-connecting-ip");
  return ip ? ip : "127.0.0.1";
};

export const rateLimitCheck = async (request: NextRequest) => {
  const identifier = getIP(request);
  const result = await ratelimit.limit(identifier);

  console.log({ result });

  if (!result.success) {
    return new NextResponse(
      JSON.stringify({
        error: "Too many requests. Please try again later.",
      }),
      {
        status: 429,
        headers: {
          "content-type": "application/json;",
        },
      }
    );
  }
};
