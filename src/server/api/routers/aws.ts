import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const awsRouter = createTRPCRouter({
  freeTierLimit: publicProcedure
    .input(z.object({ size: z.number().default(40), cursor: z.number().default(0) }))
    .query(async ({ input: { size, cursor } }) => {
      const params = {
        "item.directoryId": "free-tier-products",
        sort_by: "item.additionalFields.SortRank",
        sort_order: "asc",
        size: size + "",
        "item.locale": "en_US",
        page: cursor + "",
      };
      const url =
        "https://aws.amazon.com/api/dirs/items/search?" +
        new URLSearchParams([
          ["tags.id", "free-tier-products#tier#always-free"],
          ["tags.id", "!free-tier-products#test#test"],
          ...Object.entries(params),
        ]).toString();
      const data = await fetch(url);
      const { items, metadata, ...response } = (await data.json()) as FreeTierLimitResponse;
      return {
        items,
        metadata,
        nextPage: metadata.count === size ? cursor + 1 : undefined,
        ...response
      };
    }),
});

type FreeTierLimitResponse = {
  items: ItemType[];
  metadata: {
    count: number;
    totalHits: number;
  };
  fieldTypes: FieldType;
};

export type ItemType = {
  item: {
    id: string;
    locale: string;
    directoryId: string;
    name: string;
    author: string;
    lastUpdatedBy: string;
    dateCreated: string;
    additionalFields: FieldType;
  };
};

export type FieldType = {
  serviceType: string;
  new: string;
  imageSrcUrl: string;
  backDescriptionExtra: string;
  backDescription: string;
  cardColor: string;
  serviceName: string;
  campaignUrl: string;
  frontCtaText: string;
  SortRank: string;
  frontCtaUrl: string;
  calloutSmall: string;
  offerDetail: string;
  backCtaText: string;
  calloutLarge: string;
  backCtaUrl: string;
  frontDescription: string;
  category: string;
};
