import Navbar from "components/Navbar";
import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Dapp Boilerplate</title>
        <meta
          name="description"
          content="Next Wagmi Rainbow Chakra Boilerplate"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
    </div>
  );
};

export default Home;
