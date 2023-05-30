import { useState, type FormEvent } from "react";
import Head from "next/head";
import { type NextPage } from "next";
import { RenderState, type ChunkData } from "@/lib/types";
import Loader from "@/components/Loader";
import Answer from "@/components/Answer";
import Passage from "@/components/Passage";
import SearchForm from "@/components/Search";

const Home: NextPage = () => {
  const [query, setQuery] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [chunks, setChunks] = useState<ChunkData[]>([]);
  const [renderState, setRenderState] = useState<RenderState>(
    RenderState.EMPTY
  );

  const disabledSearchField =
    renderState === RenderState.FETCHING ||
    renderState === RenderState.RENDERING;

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(query);

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

    if (chunkResponse.status !== 200) {
      const errRes = (await chunkResponse.json()) as { error: string };
      console.log(errRes);
      setAnswer(errRes?.error || "Error");
      setRenderState(RenderState.ERROR);
      return;
    }

    const chunks = (await chunkResponse.json()) as ChunkData[];
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
        const trimmedContent = raw.replace(/^undefined|undefined$/g, "");
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
            <div className="self-start text-2xl font-bold">Answer</div>
            <Loader />
          </>
        );
      case RenderState.RENDERING || RenderState.ERROR:
        return (
          <>
            <div className="self-start text-2xl font-bold">Answer</div>
            <Answer answer={answer} />
          </>
        );
      case RenderState.LOADED:
        return (
          <>
            <div className="self-start text-2xl font-bold">Answer</div>
            <Answer answer={answer} />
            <div className="my-4 self-start text-2xl font-bold">
              Related Passages
            </div>
            {chunks &&
              chunks.map((chunk) => {
                return <Passage key={chunk.id} chunk={chunk} />;
              })}
          </>
        );
      case RenderState.ERROR:
        return (
          <>
            <div className="self-start text-2xl font-bold">Answer</div>
            <Answer answer={answer} />
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
        <link rel="icon" href="/favicon.png" sizes="any" />
      </Head>
      <main className="container mb-8 max-w-[750px]">
        <div className="flex h-full w-full max-w-[750px] flex-col items-center gap-4 px-3 pt-4 sm:pt-28">
          <h1 className="scroll-m-20 text-3xl font-bold tracking-tight text-primary lg:text-4xl">
            zuddl GPT
          </h1>
          <div className="text-center text-lg">
            AI-powered search for Zuddl&apos;s knowledge base
          </div>
          <SearchForm
            query={query}
            setQuery={setQuery}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            handleSearch={handleSearch}
            isDisabled={disabledSearchField}
          />
          {renderResponses()}
        </div>
      </main>
    </>
  );
};

export default Home;
