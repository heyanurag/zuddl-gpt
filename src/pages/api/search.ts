import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/env.mjs";
import { createClient } from "@supabase/supabase-js";
import {
  type ModerationResponse,
  type EmbeddingResponse,
  type PGChunk,
} from "@/lib/types";

export const config = {
  runtime: "edge",
  regions: "bom1", // location: ap-south-1 (optional)
};

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

const search = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { query } = (await request.json()) as {
      query: string;
    };

    const processedQuery = query.replace(/\n/g, " ");
    console.log({ processedQuery });

    const moderationRes = await fetch("https://api.openai.com/v1/moderations", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify({
        input: processedQuery,
      }),
    });

    const json = (await moderationRes?.json()) as ModerationResponse;
    const isFlagged = json?.results[0]?.flagged;

    if (!moderationRes.ok || isFlagged) {
      return new NextResponse(
        JSON.stringify({
          error:
            "We cannot process this request. Query violates our usage policies.",
        }),
        {
          status: 403,
          headers: {
            "content-type": "application/json;",
          },
        }
      );
    }

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

    const embeddingJson =
      (await queryEmbeddingRes?.json()) as EmbeddingResponse;
    const queryEmbedding = `[${String(embeddingJson?.data[0]?.embedding)}]`;

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

    return new NextResponse(
      JSON.stringify({
        error: "Something went wrong. Please try again later.",
      }),
      {
        status: 500,
        headers: {
          "content-type": "application/json;",
        },
      }
    );
  }
};

export default search;
