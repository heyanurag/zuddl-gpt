import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    OPENAI_API_KEY: z.string().min(10),
    SUPABASE_URL: z.string().min(10),
    SUPABASE_KEY: z.string().min(10),
    RESPONSE_MAX_TOKENS: z.number().int().min(9).max(1024),
    UPSTASH_REDIS_REST_URL: z.string().min(10),
    UPSTASH_REDIS_REST_KEY: z.string().min(10),
    UPSTASH_NUMBER_OF_REQUESTS: z.number().int().min(2).max(15),
    UPSTASH_REQUESTS_INTERVAL: z.number().int().min(5).max(90),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    RESPONSE_MAX_TOKENS: Number(process.env.RESPONSE_MAX_TOKENS),
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_KEY: process.env.UPSTASH_REDIS_REST_KEY,
    UPSTASH_NUMBER_OF_REQUESTS: Number(process.env.UPSTASH_NUMBER_OF_REQUESTS),
    UPSTASH_REQUESTS_INTERVAL: Number(process.env.UPSTASH_REQUESTS_INTERVAL),
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
