"use client";

import { KlineChart } from "@/components/charts/KlineChart";
import { OrderBook } from "@/components/trade/OrderBook";
import { TradeForm } from "@/components/trade/TradeForm";
import { RecentTrades } from "@/components/trade/RecentTrades";
import { useKlineData } from "@/hooks/useKlineData";
import { useParams } from "next/navigation";
import { defaultPair, availablePairs, timeframes as timeframesConfig } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { ArrowLeftRight } from 'lucide-react';


export default function TradePage() {
  const params = useParams();
  const pairParam = typeof params.pair === 'string' ? params.pair.toUpperCase() : defaultPair;
  const currentPair = availablePairs.includes(pairParam.replace('-', '/')) ? pairParam : defaultPair.replace('/', '-');
  
  const { klineData, isLoading, timeframe, changeTimeframe } = useKlineData(currentPair, timeframesConfig[1].value); // Default to 5m
  const [currentPrice, setCurrentPrice] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (klineData.length > 0) {
      setCurrentPrice(klineData[klineData.length - 1].close);
    }
  }, [klineData]);
  
  const [baseAsset, quoteAsset] = currentPair.split('-');

  return (
    <div className="flex flex-col gap-4 lg:gap-6 h-full">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3 px-4">
           <div className="flex items-center gap-4">
             <h1 className="text-2xl font-headline font-semibold">{currentPair.replace('-', '/')}</h1>
             <Select defaultValue={currentPair.replace('/', '-')} onValueChange={(value) => {
                // Ideally use router.push for navigation
                if (typeof window !== "undefined") window.location.href = `/trade/${value}`;
             }}>
                <SelectTrigger className="w-[150px] h-9">
                    <SelectValue placeholder="Select Pair" />
                </SelectTrigger>
                <SelectContent>
                    {availablePairs.map(p => (
                        <SelectItem key={p} value={p.replace('/', '-')}>{p}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
           </div>
          <div className="flex items-center gap-2">
            {timeframesConfig.map(tf => (
              <Button
                key={tf.value}
                variant={timeframe === tf.value ? "secondary" : "ghost"}
                size="sm"
                onClick={() => changeTimeframe(tf.value)}
                className="text-xs"
              >
                {tf.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0 md:p-2">
           <KlineChart data={klineData} pair={currentPair.replace('-', '/')} isLoading={isLoading} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1">
          <OrderBook pair={currentPair} />
        </div>
        <div className="lg:col-span-5 xl:col-span-6 order-1 lg:order-2">
           <Tabs defaultValue="trade" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="trade">Trade</TabsTrigger>
              <TabsTrigger value="info" disabled>Asset Info</TabsTrigger>
            </TabsList>
            <TabsContent value="trade">
              <TradeForm pair={currentPair} currentPrice={currentPrice} />
            </TabsContent>
            <TabsContent value="info">
              <Card><CardContent className="pt-6">Asset information placeholder for {currentPair}.</CardContent></Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="lg:col-span-3 order-3">
            <RecentTrades pair={currentPair} />
            <Card className="mt-4">
                 <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-lg font-headline">Open Orders</CardTitle>
                </CardHeader>
                <CardContent className="h-[150px] flex items-center justify-center text-muted-foreground">
                    No open orders.
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
