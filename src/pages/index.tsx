import { type NextPage } from "next";
import Head from "next/head";
import { SearchIcon, ArrowRightIcon } from "lucide-react";
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Zuddl GPT</title>
        <meta name="description" content="Zuddl GPT FAQ Bot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container max-w-[750px]"></main>
    </>
  );
};

export default Home;
