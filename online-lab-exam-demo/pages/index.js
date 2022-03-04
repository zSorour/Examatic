import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Demo Home Page</title>
        <meta name="description" content="Demo Home Page" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main>
        <h1>Hello World</h1>
      </main>
    </div>
  );
}
