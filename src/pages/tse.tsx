import { useMemo, useState } from "react";
import Head from "next/head";
import { api } from "~/utils/api";
import Graph from "../components/Graph";
import { useWindowSize, useDebounce } from "@uidotdev/usehooks";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  // SelectGroup,
  SelectItem,
  // SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export default function TSEPage() {
  const [code, setCode] = useState<number>(2330);
  const [type, setType] = useState<"otc" | "tse">("tse");
  const debouncedCode = useDebounce(code, 1);
  const { data, error } = api.tse.getRaw.useQuery({
    code: debouncedCode,
    type,
  });
  const size = useWindowSize();

  const parameterView = useMemo(() => {
    if (data) {
      const { bids, asks, ...rest } = data?.parameters;
      return rest
    }
  }, [data])

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
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#09070d] to-[#15162c]">
        <div className="flex">
          <Input
            className="dark text-white"
            defaultValue={code}
            onChange={(e) => setCode(Number(e.target.value))}
          />
          <Select
            defaultValue={type}
            onValueChange={(e) => {
              const value = e as typeof type;
              setType(value);
            }}
          >
            <SelectTrigger className="dark text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark text-white">
              <SelectItem value="tse">tse</SelectItem>
              <SelectItem value="otc">otc</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="container flex">
          <Table className="dark text-white">
            <TableCaption>
              Today&lsquo;s total order of {data?.metadata.name} (
              {data?.metadata.code})
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-primary">Buy</TableHead>
                <TableHead className="text-primary">Amount</TableHead>
                <TableHead className="text-destructive">Sell</TableHead>
                <TableHead className="text-destructive">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.parameters.asks.map((bid) => (
                <TableRow key={bid.price}>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell className="text-destructive">
                    {bid.price}
                  </TableCell>
                  <TableCell className="text-destructive">
                    {bid.amount}
                  </TableCell>
                </TableRow>
              ))}
              {data?.parameters.bids.map((bid) => (
                <TableRow key={bid.price}>
                  <TableCell className="text-primary">{bid.price}</TableCell>
                  <TableCell className="text-primary">{bid.amount}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <pre className="text-white">
            {JSON.stringify({ parameters: parameterView }, null, 2)}
          </pre>
          <pre className="text-white">{JSON.stringify(error, null, 2)}</pre>
        </div>
        <Graph width={size.width} height={size.height} />
      </main>
    </>
  );
}
