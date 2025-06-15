
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import type { MarketAsset } from '@/lib/mock-data';
import { generateInitialMarketData, updateMarketData } from '@/lib/mock-data';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, ResponsiveContainer, Tooltip as SparkTooltip } from 'recharts';

interface SparklineChartProps {
  data: number[];
  color: string;
}

const SparklineChart: React.FC<SparklineChartProps> = ({ data, color }) => {
  const chartData = data.map((value, index) => ({ name: index, value }));
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={chartData}>
         <SparkTooltip 
            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}} 
            itemStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
            labelFormatter={() => ''}
            />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};


export function MarketTable() {
  const [assets, setAssets] = useState<MarketAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialData = generateInitialMarketData();
    setAssets(initialData);
    setIsLoading(false);

    const intervalId = setInterval(() => {
      setAssets(prevAssets => updateMarketData(prevAssets));
    }, 2000); // Update every 2 seconds

    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 border-b rounded-lg">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-20 hidden md:block" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border shadow-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Asset</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">24h Change</TableHead>
            <TableHead className="text-right hidden md:table-cell">24h Volume</TableHead>
            <TableHead className="text-center hidden lg:table-cell w-[150px]">Last 7 Days</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id} className="hover:bg-muted/50 transition-colors">
              <TableCell>
                <Link href={`/trade/${asset.pair.replace('/', '-')}`} className="flex items-center gap-3 group">
                  <Image 
                    src={asset.iconUrl || `https://placehold.co/32x32.png`} 
                    alt={asset.name} 
                    width={32} 
                    height={32} 
                    className="rounded-full"
                    data-ai-hint={`${asset.name} icon`}
                  />
                  <div>
                    <div className="font-medium group-hover:text-primary transition-colors">{asset.name}</div>
                    <div className="text-xs text-muted-foreground">{asset.pair}</div>
                  </div>
                </Link>
              </TableCell>
              <TableCell className="text-right font-mono">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: asset.id === 'dogecoin' ? 4 : 2 })}</TableCell>
              <TableCell className={`text-right font-medium ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <div className="flex items-center justify-end">
                  {asset.change24h >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                  {asset.change24h.toFixed(2)}%
                </div>
              </TableCell>
              <TableCell className="text-right hidden md:table-cell font-mono">${asset.volume24h.toLocaleString()}</TableCell>
              <TableCell className="hidden lg:table-cell">
                 <SparklineChart data={asset.sparkline} color={asset.change24h >= 0 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"} />
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/trade/${asset.pair.replace('/', '-')}`}>
                    Trade
                    <TrendingUp className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
