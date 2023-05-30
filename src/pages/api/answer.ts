import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/env.mjs";
import { type OpenAIStreamPayload, type PGChunk } from "@/lib/types";
import { getPrompt } from "@/lib/utils";
import { OpenAIStream } from "@/lib/OpenAIStream";
import { createClient } from "@supabase/supabase-js";

export const config = {
  runtime: "edge",
  regions: "bom1", // location: ap-south-1 (optional)
};

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

const answer = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { chunks, query } = (await request.json()) as {
      chunks: PGChunk[];
      query: string;
    };

    const processedQuery = query.replace(/\n/g, " ");

    const prompt = getPrompt(processedQuery, chunks);

    const payload: OpenAIStreamPayload = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: Number(env.RESPONSE_MAX_TOKENS),
      stream: true,
      n: 1,
    };

    const stream = await OpenAIStream(payload);

    return new NextResponse(stream);
  } catch (error) {
    console.error({ error });
    return new NextResponse("Error", { status: 500 });
  }
};

export default answer;
