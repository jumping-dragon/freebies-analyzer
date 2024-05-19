import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const tseRouter = createTRPCRouter({
  getRaw: publicProcedure
    .input(
      z.object({
        code: z.number().default(2330),
        type: z.string().default("tse"),
      })
    )
    .query(async ({ input }) => {
      const url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${input.type}_${input.code}.tw&json=2&delay=0&_=1635167108897`;
      const test = await fetch(url);
      const response = (await test.json()) as RawResponse;
      const metadataHaystack = response.msgArray[0];
      if (!metadataHaystack) {
        throw Error("Failed to parse metadata");
      }
      const metadata = getStockMetadata(metadataHaystack);
      const parameters = getStockParameters(metadataHaystack);
      const returnt = { metadata, parameters };
      return returnt;
    }),
});

export type RawResponse = {
  msgArray: RawStockInfo[];
};

export type RawStockInfo = {
  z: string; // z	當前盤中成交價
  tv: string; // tv	當前盤中盤成交量
  v: string; // v	累積成交量
  b: string; // b	揭示買價(從高到低，以_分隔資料)
  g: string; // g	揭示買量(配合b，以_分隔資料)
  a: string; // a	揭示賣價(從低到高，以_分隔資料)
  f: string; // f	揭示賣量(配合a，以_分隔資料)
  o: string; // o	開盤價格
  h: string; // h	最高價格
  l: string; // l	最低價格
  y: string; // y	昨日收盤價格
  u: string; // u	漲停價
  w: string; // w	跌停價
  tlong: string; // tlong	資料更新時間（單位：毫秒）
  d: string; // d	最近交易日期（YYYYMMDD）
  t: string; // t	最近成交時刻（HH:MI:SS）
  c: string; // c	股票代號
  n: string; // n	公司簡稱
  nf: string; // nf	公司全名
};

export type StockMetadata = {
  code: string;
  name: string;
  nameFull: string;
};

function getStockMetadata({ c, n, nf }: RawStockInfo): StockMetadata {
  return {
    code: c,
    name: n,
    nameFull: nf,
  };
}

function getStockParameters({
  tlong,
  h,
  l,
  o,
  v,
  b,
  g,
  a,
  f,
}: RawStockInfo): StockParameters {
  return {
    // date: `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6, 8)}T${t} `,
    date: new Date(Number(tlong)).toISOString(),
    high: Number(h),
    low: Number(l),
    open: Number(o),
    volume: Number(v),
    bids: parseOrder(b, g),
    asks: parseOrder(a, f).reverse(),
  };
}

type Order = {
  amount: number;
  price: number;
};

function parseOrder(priceData: string, amountData: string): Order[] {
  const priceArray = priceData.split("_").filter((item) => item !== "");
  const amountArray = amountData.split("_").filter((item) => item !== "");

  // Combine them into an array of objects
  return priceArray.map((price, index) => {
    return {
      price: parseFloat(price),
      amount: parseInt(amountArray[index]!, 10),
    };
  });
}

export type StockParameters = {
  date: string;
  high: number;
  low: number;
  open: number;
  bids: Order[];
  asks: Order[];
  volume: number;
};
