import { useState, type FormEvent } from "react";
import Head from "next/head";
import { type NextPage } from "next";
import { SearchIcon, ArrowRightIcon } from "lucide-react";

const Home: NextPage = () => {
  const [query, setQuery] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(query);

    const answerResponse = await fetch("/api/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

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
        return prev + chunkValue;
      });
    }
  };

  return (
    <>
      <Head>
        <title>Zuddl GPT</title>
        <meta name="description" content="Zuddl GPT FAQ Bot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container max-w-[750px]">
        <div className="flex h-full w-full max-w-[750px] flex-col items-center gap-4 px-3 pt-4 sm:pt-28">
          <h1 className="scroll-m-20 text-3xl font-bold tracking-tight text-primary lg:text-4xl">
            zuddl GPT
          </h1>
          <div className="text-center text-lg">
            AI-powered search for Zuddl&apos;s knowledge base
          </div>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form className="relative w-full" onSubmit={handleSearch}>
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
          <div>{answer}</div>
        </div>
      </main>
    </>
  );
};

export default Home;
