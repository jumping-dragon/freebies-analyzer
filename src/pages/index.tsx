import { useMotionValueEvent, useScroll } from "framer-motion";
import Head from "next/head";
import React from "react";
import { type ItemType } from "~/server/api/routers/aws";
import { api } from "~/utils/api";

export default function Home() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = api.aws.freeTierLimit.useInfiniteQuery(
    {
      size: 19,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    },
  );

  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, "change", () => {
    const parameter = scrollYProgress.get();
    if (
      parameter >= 0.8 &&
      parameter <= 0.99 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage().catch((error) => console.log(error));
      // console.log("FETCHING NEXT PAGE", parameter);
    }
  });

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
          <div className="text-2xl text-white flex flex-col" style={{ color: "#fff" }}>
            {data?.pages.map((page) => page.items.map((i, id) => (
              <FreeTierItem key={id} item={i.item} />
            )))}
          </div>
          <div className="text-lg italic text-center">
            {error
              ? error.message
              : hasNextPage
                ? isFetchingNextPage
                  ? "Loading more..."
                  : "Scroll to load more"
                : isFetching
                  ? "Loading..."
                  : data?.pages && data?.pages[0]?.metadata.totalHits === 0
                    ? "No free stuff here"
                    : "You've reached the bottom"}
          </div>
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
