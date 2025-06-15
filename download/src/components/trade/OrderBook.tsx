"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from '@/components/ui/skeleton';

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

const generateMockOrders = (count: number, basePrice: number, type: 'buy' | 'sell'): OrderBookEntry[] => {
  const orders: OrderBookEntry[] = [];
  let cumulativeAmount = 0;
  for (let i = 0; i < count; i++) {
    const priceFluctuation = (Math.random() - (type === 'buy' ? 0.6 : 0.4)) * basePrice * 0.01;
    const price = parseFloat((basePrice + priceFluctuation).toFixed(2));
    const amount = parseFloat((Math.random() * 5).toFixed(4));
    cumulativeAmount += amount;
    orders.push({ price, amount, total: parseFloat(cumulativeAmount.toFixed(4)) });
  }
  return type === 'buy' ? orders.sort((a,b) => b.price - a.price) : orders.sort((a,b) => a.price - b.price);
};

export function OrderBook({ pair }: { pair: string }) {
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastPrice, setLastPrice] = useState(60000); // Mock last traded price

  useEffect(() => {
    const basePrice = pair.startsWith('BTC') ? 60000 : pair.startsWith('ETH') ? 3000 : 150;
    setLastPrice(basePrice * (1 + (Math.random() - 0.5) * 0.001)); // Slight variation for last price

    const initialBids = generateMockOrders(20, basePrice * 0.999, 'buy');
    const initialAsks = generateMockOrders(20, basePrice * 1.001, 'sell');
    setBids(initialBids);
    setAsks(initialAsks);
    setIsLoading(false);

    const intervalId = setInterval(() => {
      setBids(prevBids => 
        generateMockOrders(20, prevBids[0]?.price || basePrice * 0.999, 'buy')
      );
      setAsks(prevAsks => 
        generateMockOrders(20, prevAsks[0]?.price || basePrice * 1.001, 'sell')
      );
      setLastPrice(prevLast => prevLast * (1 + (Math.random() - 0.5) * 0.0005));
    }, 2500); // Update every 2.5 seconds

    return () => clearInterval(intervalId);
  }, [pair]);

  const renderOrderRows = (orders: OrderBookEntry[], type: 'buy' | 'sell') => {
    return orders.map((order, index) => (
      <TableRow key={index} className="text-xs hover:bg-muted/30 relative">
        <TableCell className={`py-1 px-2 font-mono ${type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
          {order.price.toFixed(2)}
        </TableCell>
        <TableCell className="py-1 px-2 text-right font-mono">{order.amount.toFixed(4)}</TableCell>
        <TableCell className="py-1 px-2 text-right font-mono">{order.total.toFixed(4)}</TableCell>
        <div 
          className={`absolute top-0 ${type === 'buy' ? 'right-0' : 'left-0'} h-full opacity-10`}
          style={{ width: `${(order.amount / 5) * 100}%`, backgroundColor: type === 'buy' ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-1))' }}
        />
      </TableRow>
    ));
  };
  
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader><CardTitle className="text-lg font-headline">Order Book</CardTitle></CardHeader>
        <CardContent>
          {Array(10).fill(0).map((_,i) => <Skeleton key={i} className="h-6 w-full mb-1" />)}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-lg font-headline">Order Book</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-[calc(50vh-100px)] md:h-full max-h-[600px]">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="text-muted-foreground">
                <TableHead className="py-1 px-2 w-1/3">Price (USDT)</TableHead>
                <TableHead className="py-1 px-2 w-1/3 text-right">Amount ({pair.split('-')[0]})</TableHead>
                <TableHead className="py-1 px-2 w-1/3 text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderOrderRows(asks, 'sell').reverse()}</TableBody>
          </Table>
          <div className="py-2 text-center border-y my-1">
            <span className={`font-bold text-lg ${asks[0]?.price > bids[0]?.price ? (lastPrice > (asks[0]?.price + bids[0]?.price)/2 ? 'text-green-500' : 'text-red-500') : 'text-foreground'}`}>
              ${lastPrice.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground ml-2">
              Spread: ${Math.abs((asks[0]?.price || 0) - (bids[0]?.price || 0)).toFixed(2)}
            </span>
          </div>
          <Table className="text-xs">
             <TableBody>{renderOrderRows(bids, 'buy')}</TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
