"use client";

import { KlineChart } from "@/components/charts/KlineChart";
import { useKlineData } from "@/hooks/useKlineData";
import { useParams } from "next/navigation";
import { defaultPair, availablePairs, timeframes as timeframesConfig } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';

export default function KlineDetailsPage() {
  const params = useParams();
  const pairParam = typeof params.pair === 'string' ? params.pair.toUpperCase() : defaultPair;
  const currentPair = availablePairs.includes(pairParam.replace('-', '/')) ? pairParam : defaultPair.replace('/', '-');
  
  const { klineData, isLoading, timeframe, changeTimeframe } = useKlineData(currentPair, timeframesConfig[3].value); // Default to 1H

  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-3xl font-headline mb-1">{currentPair.replace('-', '/')} Candlestick Chart</CardTitle>
            <CardDescription>Detailed price action and historical data.</CardDescription>
          </div>
           <div className="flex items-center gap-2 flex-wrap">
             <Select defaultValue={currentPair.replace('/', '-')} onValueChange={(value) => {
                // Ideally use router.push for navigation
                if (typeof window !== "undefined") window.location.href = `/charts/${value}`;
             }}>
                <SelectTrigger className="w-[180px] h-10">
                    <SelectValue placeholder="Select Pair" />
                </SelectTrigger>
                <SelectContent>
                    {availablePairs.map(p => (
                        <SelectItem key={p} value={p.replace('/', '-')}>{p}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button asChild variant="outline">
                <Link href={`/trade/${currentPair}`}>Go to Trade</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-2 py-4 md:p-6">
          <div className="mb-4 flex justify-center md:justify-end">
            <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
              {timeframesConfig.map(tf => (
                <Button
                  key={tf.value}
                  variant={timeframe === tf.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => changeTimeframe(tf.value)}
                  className="px-3 py-1.5 text-xs"
                >
                  {tf.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="h-[60vh] min-h-[400px] md:min-h-[500px]">
            <KlineChart data={klineData} pair={currentPair.replace('-', '/')} isLoading={isLoading} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Technical Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Technical indicators section (e.g., RSI, MACD, Moving Averages) will be available here in a future update.</p>
          {/* Placeholder for indicator controls */}
        </CardContent>
      </Card>
    </div>
  );
}
