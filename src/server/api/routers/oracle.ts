import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const oracleRouter = createTRPCRouter({
  freeTierLimit: publicProcedure
    .query(async () => {
      const url = "https://www.oracle.com/a/ocom/docs/oci-free-tier_v1.json"
      const data = await fetch(url);
      const response = (await data.json()) as FreeTierLimitResponse;
      return response.filter((r) => r.Free_Period === "Always Free")
    }),
});

type FreeTierLimitResponse = FreeTierLimit[]

type FreeTierLimit = {
  Featured_Product: string,
  Free_Period: string,
  Product_Category: string,
  fields: Record<string, string>,
  Description: string,
  Monthly_Free_Amount: string,
  cta_link: string
}
