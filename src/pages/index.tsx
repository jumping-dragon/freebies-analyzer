import Head from "next/head";
import React from "react";
import { type ItemType } from "~/server/api/routers/aws";
import { api } from "~/utils/api";

export default function Home() {
  const aws = api.aws.freeTierLimit.useQuery();

  return (
    <>
      <Head>
        <title>Freebies Analyzer</title>
        <meta name="description" content="freebies analyzer for aws" />
        <link rel="icon" href="/assets/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Freebies Analyzer
          </h1>
          <p className="text-2xl text-white" style={{ color: "#fff" }}>
            {aws.data
              ? aws.data.items.map((i, id) => (
                  <FreeTierItem key={id} item={i.item} />
                ))
              : "Loading..."}
          </p>
        </div>
      </main>
    </>
  );
}

export type FreeTierItemProps = React.InputHTMLAttributes<HTMLInputElement> &
  ItemType;

const FreeTierItem = React.forwardRef<HTMLInputElement, FreeTierItemProps>(
  ({ item, className, type, ...props }, ref) => {
    const { additionalFields, ...otherProps } = item;
    return (
      <div className="mb-4 flex items-center justify-around">
        {/* <pre>
          {JSON.stringify(otherProps, null, 4)}
        </pre> */}
        {/* <img src={additionalFields.imageSrcUrl} alt="item-logo" /> */}
        <div>{additionalFields.serviceName}</div>
        {/* <div>{additionalFields.backDescriptionExtra}</div> */}
        <div
          dangerouslySetInnerHTML={{ __html: additionalFields.backDescription }}
        />
      </div>
    );
  },
);
FreeTierItem.displayName = "FreeTierItem";
