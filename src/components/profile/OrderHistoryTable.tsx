"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Order {
  id: string;
  date: Date;
  pair: string;
  type: 'Limit' | 'Market';
  side: 'Buy' | 'Sell';
  price: number;
  amount: number;
  filled: number;
  total: number;
  status: 'Filled' | 'Partially Filled' | 'Cancelled' | 'Pending';
}

const mockOrders: Order[] = Array.from({ length: 20 }).map((_, i) => {
  const side = Math.random() > 0.5 ? 'Buy' : 'Sell';
  const pairOptions = ["BTC/USDT", "ETH/USDT", "SOL/USDT"];
  const pair = pairOptions[Math.floor(Math.random() * pairOptions.length)];
  const basePrice = pair.startsWith("BTC") ? 60000 : pair.startsWith("ETH") ? 3000 : 150;
  const price = basePrice * (1 + (Math.random() - 0.5) * 0.1);
  const amount = Math.random() * (pair.startsWith("BTC") ? 1 : pair.startsWith("ETH") ? 10 : 100);
  const filled = amount * (Math.random() * 0.5 + 0.5); // 50-100% filled
  const statusOptions: Order['status'][] = ['Filled', 'Partially Filled', 'Cancelled'];
  
  return {
    id: `ORD${1000 + i}`,
    date: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30), // Within last 30 days
    pair,
    type: Math.random() > 0.3 ? 'Limit' : 'Market',
    side,
    price: parseFloat(price.toFixed(2)),
    amount: parseFloat(amount.toFixed(4)),
    filled: parseFloat(filled.toFixed(4)),
    total: parseFloat((price * filled).toFixed(2)),
    status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
  };
}).sort((a,b) => b.date.getTime() - a.date.getTime());


export function OrderHistoryTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching orders
    setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1500);
  }, []);

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'Filled': return 'default'; // default is primary based on theme
      case 'Partially Filled': return 'secondary';
      case 'Cancelled': return 'destructive';
      case 'Pending': return 'outline';
      default: return 'outline';
    }
  };


  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent>
          {Array(5).fill(0).map((_, i) => (
             <div key={i} className="flex items-center justify-between p-2 border-b">
                <div className="space-y-1 w-1/4"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-3/4" /></div>
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-6 w-16" />
             </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Order History</CardTitle>
        <CardDescription>Review your past trading activity.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] md:h-[500px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Pair</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Side</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Filled</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="text-sm hover:bg-muted/50">
                  <TableCell>{format(order.date, 'yyyy-MM-dd HH:mm')}</TableCell>
                  <TableCell>{order.pair}</TableCell>
                  <TableCell>{order.type}</TableCell>
                  <TableCell className={`font-medium ${order.side === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>
                    <div className="flex items-center">
                      {order.side === 'Buy' ? <ArrowDownRight className="h-4 w-4 mr-1"/> : <ArrowUpRight className="h-4 w-4 mr-1"/>}
                      {order.side}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">${order.price.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">{order.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">{order.filled.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">${order.total.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs">
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
