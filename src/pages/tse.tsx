import Head from "next/head";
import Link from "next/link";
import { type ItemType } from "~/server/api/routers/aws";
import { api } from "~/utils/api";
import Graph from '../components/Graph'
import { useWindowSize } from "@uidotdev/usehooks";

export default function TSEPage() {
  const hello = api.tse.getStockInfo.useQuery();
  const size = useWindowSize();

  if (size.width === null || size.height === null) {
    return null;
  }

  return (
    <>
      <Head>
        <title>TSE</title>
        <meta name="description" content="freebies analyzer for aws" />
        <link rel="icon" href="/assets/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div>{JSON.stringify(hello,null,2)}</div>
        <Graph width={size.width} height={size.height} />
      </main >
    </>
  );
}