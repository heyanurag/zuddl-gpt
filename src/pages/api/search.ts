import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/env.mjs";
import { createClient } from "@supabase/supabase-js";
import { type EmbeddingResponse, type PGChunk } from "@/lib/types";

export const config = {
  runtime: "edge",
  regions: "bom1", // location: ap-south-1 (optional)
};

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

const answer = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { query } = (await request.json()) as {
      query: string;
    };

    const processedQuery = query.replace(/\n/g, " ");
    console.log({ processedQuery });

    const queryEmbeddingRes = await fetch(
      "https://api.openai.com/v1/embeddings",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({
          model: "text-embedding-ada-002",
          input: processedQuery,
        }),
      }
    );

    const json = (await queryEmbeddingRes?.json()) as EmbeddingResponse;
    const queryEmbedding = `[${String(json?.data[0]?.embedding)}]`;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data: chunks } = await supabase.rpc("article_search", {
      query_embedding: queryEmbedding,
      similarity_threshold: 0.01,
      match_count: 3,
    });

    const chunksData = (chunks as PGChunk[]).map((chunk) => {
      return {
        id: chunk.id,
        article_title: chunk.article_title,
        article_url: chunk.article_url,
        content: chunk.content,
      };
    });

    return new NextResponse(JSON.stringify(chunksData), {
      headers: {
        "content-type": "application/json;",
      },
    });
  } catch (error) {
    console.error({ error });
    return new NextResponse("Error", { status: 500 });
  }
};

export default answer;
