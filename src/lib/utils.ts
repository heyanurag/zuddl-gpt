import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { oneLine, stripIndent } from "common-tags";
import { type PGChunk } from "@/lib/types";

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

    Context sections:
    ${chunks?.map((d: PGChunk) => d.content).join("\n\n")}

    Question: """
    ${query}
    """

    Answer as markdown (do not include any links in the answer).
  `;

  return prompt;
};
