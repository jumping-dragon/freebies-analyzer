import Head from "next/head";
import Link from "next/link";
import { type ItemType } from "~/server/api/routers/aws";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.aws.freeTierLimit.useQuery({ size: 100 });

  return (
    <>
      <Head>
        <title>Freebies Analyzer</title>
        <meta name="description" content="freebies analyzer for aws" />
        <link rel="icon" href="/assets/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Freebies Analyzer
          </h1>
          <p className="text-2xl text-white" style={{ color: '#fff' }}>
            {hello.data ? hello.data.items.map(FreeTierItem) : "Loading tRPC query..."}
          </p>
        </div>
      </main >
    </>
  );
}

function FreeTierItem({ item }: ItemType) {
  const  { additionalFields, ...otherProps } = item;
  return (
    <div className="mb-4 flex items-center justify-around">
      {/* <pre>
        {JSON.stringify(otherProps, null, 4)}
      </pre> */}
      {/* <img src={additionalFields.imageSrcUrl} alt="item-logo" /> */}
      <div>{additionalFields.serviceName}</div>
      {/* <div>{additionalFields.backDescriptionExtra}</div> */}
      <div dangerouslySetInnerHTML={{__html : additionalFields.backDescription}} />
    </div>
  )
}