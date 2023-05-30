export type ChunkData = {
  id: number;
  article_title: string;
  article_url: string;
  content: string;
};

export type ChatGPTAgent = "user" | "system";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export interface OpenAIStreamPayload {
  model: string;
  messages: ChatGPTMessage[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
}

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

export type EmbeddingResponse = {
  data: [
    {
      embedding: string;
    }
  ];
};

export type ModerationResponse = {
  results: [
    {
      flagged: boolean;
    }
  ];
};

export enum RenderState {
  EMPTY = "empty",
  FETCHING = "fetching",
  RENDERING = "rendering",
  LOADED = "loaded",
  ERROR = "error",
}
