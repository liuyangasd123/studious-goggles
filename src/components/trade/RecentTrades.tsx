"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface TradeEntry {
  time: number;
  price: number;
  amount: number;
  type: 'buy' | 'sell';
}

const generateMockTrades = (count: number, basePrice: number): TradeEntry[] => {
  const trades: TradeEntry[] = [];
  let currentTime = Date.now();
  for (let i = 0; i < count; i++) {
    const priceFluctuation = (Math.random() - 0.5) * basePrice * 0.005;
    const price = parseFloat((basePrice + priceFluctuation).toFixed(2));
    const amount = parseFloat((Math.random() * 1).toFixed(4)); // smaller amounts for individual trades
    trades.push({
      price,
      amount,
      time: currentTime - Math.random() * 1000 * i, // trades happened in near past
      type: Math.random() > 0.5 ? 'buy' : 'sell',
    });
  }
  return trades.sort((a,b) => b.time - a.time);
};

export function RecentTrades({ pair }: { pair: string }) {
  const [trades, setTrades] = useState<TradeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const basePrice = pair.startsWith('BTC') ? 60000 : pair.startsWith('ETH') ? 3000 : 150;
    const initialTrades = generateMockTrades(30, basePrice);
    setTrades(initialTrades);
    setIsLoading(false);

    const intervalId = setInterval(() => {
      setTrades(prevTrades => {
        const newTradePrice = prevTrades[0]?.price * (1 + (Math.random() - 0.5) * 0.0002) || basePrice;
        const newTrade: TradeEntry = {
          price: parseFloat(newTradePrice.toFixed(2)),
          amount: parseFloat((Math.random() * 0.5).toFixed(4)),
          time: Date.now(),
          type: Math.random() > 0.5 ? 'buy' : 'sell',
        };
        return [newTrade, ...prevTrades.slice(0,49)].sort((a,b) => b.time - a.time); // keep max 50 trades
      });
    }, 3000); // New trade every 3 seconds

    return () => clearInterval(intervalId);
  }, [pair]);
  
  if (isLoading) {
     return (
      <Card>
        <CardHeader><CardTitle className="text-lg font-headline">Recent Trades</CardTitle></CardHeader>
        <CardContent>
            {Array(5).fill(0).map((_,i) => <Skeleton key={i} className="h-6 w-full mb-1" />)}
        </CardContent>
      </Card>
    )
  }


  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-lg font-headline">Recent Trades</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-[calc(50vh-100px)] md:h-full max-h-[300px]">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="text-muted-foreground">
                <TableHead className="py-1 px-2 w-1/3">Time</TableHead>
                <TableHead className="py-1 px-2 w-1/3 text-right">Price ({pair.split('-')[1]})</TableHead>
                <TableHead className="py-1 px-2 w-1/3 text-right">Amount ({pair.split('-')[0]})</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade, index) => (
                <TableRow key={index} className="hover:bg-muted/30">
                  <TableCell className="py-1 px-2 font-mono text-muted-foreground">
                    {format(new Date(trade.time), 'HH:mm:ss')}
                  </TableCell>
                  <TableCell className={`py-1 px-2 text-right font-mono ${trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                    {trade.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-1 px-2 text-right font-mono">{trade.amount.toFixed(4)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
