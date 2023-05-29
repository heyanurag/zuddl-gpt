import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/env.mjs";
import { oneLine, stripIndent } from "common-tags";
import { type PGChunk } from "@/pages/api/answer";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPrompt = (query: string, chunks: PGChunk[]) => {
  const prompt = stripIndent`${oneLine`
    You are a very enthusiastic Zuddl representativeand an experienced event
    marketer who loves to help people! Given the following sections from the
    Zuddl knowledge base, answer the question using only that information,
    outputted in markdown format. If you are unsure and the answer
    is not explicitly written in the documentation, say
    "Sorry, I don't know how to help with that."`}

    Retaled article links:
    ${chunks?.map((d: PGChunk) => d.article_url).join("\n")}

    Context sections:
    ${chunks?.map((d: PGChunk) => d.content).join("\n\n")}

    Question: """
    ${query}
    """

    Answer as markdown (also include all the related article links).
  `;

  return prompt;
};
