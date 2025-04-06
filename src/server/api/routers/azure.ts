import { JSDOM } from "jsdom"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const azureRouter = createTRPCRouter({
  freeTierLimit: publicProcedure
    .query(async () => {
      const url = "https://azure.microsoft.com/en-us/pricing/free-services"
      const data = await fetch(url);
      const rawHtml = await data.text();
      const dom = new JSDOM(rawHtml)
      const tablesHtml = dom.window.document.querySelectorAll("tr")
      const tables = Array.from(tablesHtml)
        .reduce((a, row) => {
          const r = row.textContent ? row.textContent.trim().split("   ") : []
          if (r) {
            a.push({
              service: r[0],
              description: r[1],
              type: r[2],
              freeMonthlyAmount: r[3],
              freePeriod: r[4],

            } as FreeTierLimit)
          }
          return a
        }, [] as FreeTierLimitResponse)
        .filter((r) => r.freePeriod === "Always")
      return tables
    }),
});

type FreeTierLimitResponse = FreeTierLimit[]

type FreeTierLimit = {
  service: string,
  description: string,
  type: string,
  freeMonthlyAmount: string,
  freePeriod: string,
}
