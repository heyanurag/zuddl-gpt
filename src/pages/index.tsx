import { useState, type FormEvent } from "react";
import Head from "next/head";
import { type NextPage } from "next";
import { SearchIcon, ArrowRightIcon } from "lucide-react";
import { type ChunkData } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

enum RenderState {
  EMPTY = "empty",
  FETCHING = "fetching",
  RENDERING = "rendering",
  LOADED = "loaded",
}

const Home: NextPage = () => {
  const [query, setQuery] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [chunks, setChunks] = useState<ChunkData[]>([]);
  const [renderState, setRenderState] = useState<RenderState>(RenderState.EMPTY);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(query);

    setQuery("");
    setAnswer("");
    setChunks([]);
    setRenderState(RenderState.FETCHING);

    const chunkResponse = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const chunks = await chunkResponse.json() as ChunkData[];
    setChunks(chunks);

    const answerResponse = await fetch("/api/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chunks, query }),
    });

    setRenderState(RenderState.RENDERING);

    const data = answerResponse.body as ReadableStream;
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = (await reader.read()) as {
        value: BufferSource;
        done: boolean;
      };
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setAnswer((prev) => {
        console.log({ prev, chunkValue });
        const raw = prev + chunkValue;
        const trimmedContent = raw.replace(/^undefined|undefined$/g, '');
        return trimmedContent;
      });
    }

    setRenderState(RenderState.LOADED);
  };

  const renderResponses = () => {
    switch (renderState) {
      case RenderState.EMPTY:
        return <></>;
      case RenderState.FETCHING:
        return (
          <>
            <div className="font-bold text-2xl self-start">Answer</div>
            <div className="animate-pulse mt-2 self-start w-full">
              <div className="h-8 w-1/2 bg-gray-300 rounded"></div>
              <div className="h-4 w-full bg-gray-300 rounded mt-4"></div>
              <div className="h-4 w-full bg-gray-300 rounded mt-2"></div>
              <div className="h-4 w-full bg-gray-300 rounded mt-2"></div>
              <div className="h-4 w-full bg-gray-300 rounded mt-2"></div>
            </div>
          </>
        );
      case RenderState.RENDERING:
        return (
          <>
            <div className="font-bold text-2xl self-start">Answer</div>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              linkTarget="_blank"
              className="prose"
            >
              {answer}
            </ReactMarkdown>
          </>
        );
      case RenderState.LOADED:
        return (
          <>
            <div className="font-bold text-2xl self-start">Answer</div>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              linkTarget="_blank"
              className="prose"
            >
              {answer}
            </ReactMarkdown>
            <div className="font-bold text-2xl self-start my-4">Related Passages</div>
            {chunks && chunks.map((chunk) => {
              const title_array = chunk.article_title.split(":");
              const title = title_array.slice(0, -1).join(":");

              return (
                <div key={chunk.id} className="mb-6 relative w-full bg-white shadow-md rounded-lg border border-black">
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{title}</h3>
                    <p className="text-gray-600">{chunk.content}</p>
                  </div>
                  <a
                    href={chunk.article_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 text-gray-700 hover:text-gray-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>
              )
            })}
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <Head>
        <title>Zuddl GPT</title>
        <meta name="description" content="Zuddl GPT FAQ Bot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container max-w-[750px] mb-8">
        <div className="flex h-full w-full max-w-[750px] flex-col items-center gap-4 px-3 pt-4 sm:pt-28">
          <h1 className="scroll-m-20 text-3xl font-bold tracking-tight text-primary lg:text-4xl">
            zuddl GPT
          </h1>
          <div className="text-center text-lg">
            AI-powered search for Zuddl&apos;s knowledge base
          </div>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form className="relative w-full mb-4" onSubmit={handleSearch}>
            <SearchIcon className="absolute left-1 top-3 h-6 w-10 rounded-full opacity-90 sm:left-3 sm:top-4 sm:h-8" />

            <input
              className="h-12 w-full rounded-full border border-zinc-600 pl-11 pr-12 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 sm:h-16 sm:py-2 sm:pl-16 sm:pr-16 sm:text-lg"
              type="text"
              placeholder="How do I add a virtual background?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />

            <button type="submit">
              <ArrowRightIcon className="absolute right-2 top-2.5 h-7 w-7 rounded-full bg-primary p-1 text-white hover:cursor-pointer hover:opacity-80 sm:right-3 sm:top-3 sm:h-10 sm:w-10" />
            </button>
          </form>
          <div>
            {renderResponses()}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
