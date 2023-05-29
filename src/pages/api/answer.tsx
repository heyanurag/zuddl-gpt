import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/env.mjs";
import { getPrompt, supabase } from "@/lib/utils";
import { OpenAIStream, type OpenAIStreamPayload } from "@/lib/OpenAIStream";

export const config = {
  runtime: "edge",
  regions: "bom1", // location: ap-south-1 (optional)
};

type EmbeddingResponse = {
  data: [
    {
      embedding: string;
    }
  ];
};

export type PGChunk = {
  id: number;
  article_title: string;
  article_url: string;
  content: string;
  content_length: number;
  content_tokens: number;
  embedding: number[];
  similarity: number;
};

const answer = async (request: NextRequest): Promise<NextResponse> => {
  const { query } = (await request.json()) as {
    query: string;
  };

  const processedQuery = query.replace(/\n/g, " ");

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
  const queryEmbedding = String(json?.data[0]?.embedding);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data: chunks, error } = await supabase.rpc("article_search", {
    query_embedding: queryEmbedding,
    similarity_threshold: 0.01,
    match_count: 3,
  });

  if (error) console.error(error);
  else console.log(chunks);

  const prompt = getPrompt(processedQuery, chunks as PGChunk[]);

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);

  return new NextResponse(stream);
};

export default answer;
