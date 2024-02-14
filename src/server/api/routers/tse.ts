import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const tseRouter = createTRPCRouter({
  getStockInfo: publicProcedure.query(async () => {
    // .input(z.object({ size: z.number().default(40) }))
    //   const params = {
    //     "item.directoryId": "free-tier-products",
    //     "sort_by":"item.additionalFields.SortRank",
    //     "sort_order":"asc",
    //     "size": input.size + "",
    //     "item.locale":"en_US",
    //   };
    //   const url = "https://aws.amazon.com/api/dirs/items/search?" + new URLSearchParams([
    //     ["tags.id", "free-tier-products#tier#always-free"],
    //     ["tags.id", "!free-tier-products#test#test"],
    //     ...Object.entries(params)
    //   ]).toString();
    const url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_2330.tw&json=1&delay=0&_=1635167108897`;
    const test = await fetch(url);
    const response = await test.json() as StockInfo;
    return { ...response };
  }),
});

// z	當前盤中成交價
// tv	當前盤中盤成交量
// v	累積成交量
// b	揭示買價(從高到低，以_分隔資料)
// g	揭示買量(配合b，以_分隔資料)
// a	揭示賣價(從低到高，以_分隔資料)
// f	揭示賣量(配合a，以_分隔資料)
// o	開盤價格
// h	最高價格
// l	最低價格
// y	昨日收盤價格
// u	漲停價
// w	跌停價
// tlong	資料更新時間（單位：毫秒）
// d	最近交易日期（YYYYMMDD）
// t	最近成交時刻（HH:MI:SS）
// c	股票代號
// n	公司簡稱
// nf	公司全名
export type StockInfo = {
  z: string;
  tv: string;
  v: string;
  b: string;
  g: string;
  a: string;
  f: string;
  o: string;
  h: string;
  l: string;
  y: string;
  u: string;
  w: string;
  tlong: string;
  d: string;
  t: string;
  c: string;
  n: string;
  nf: string;
};
