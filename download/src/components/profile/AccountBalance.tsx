
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, TrendingUp, Download, Upload } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

interface AssetBalance {
  asset: string;
  balance: number;
  usdValue: number;
  iconUrl?: string;
}

const mockBalances: AssetBalance[] = [
  { asset: "USDT", balance: 10000.50, usdValue: 10000.50, iconUrl: "https://placehold.co/32x32.png" },
  { asset: "BTC", balance: 0.50123, usdValue: 30073.80, iconUrl: "https://placehold.co/32x32.png" },
  { asset: "ETH", balance: 10.12345, usdValue: 30370.35, iconUrl: "https://placehold.co/32x32.png" },
  { asset: "SOL", balance: 150.75, usdValue: 22612.50, iconUrl: "https://placehold.co/32x32.png" },
];

export function AccountBalance() {
  const [showBalance, setShowBalance] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching balances
    setTimeout(() => {
      const total = mockBalances.reduce((sum, asset) => sum + asset.usdValue, 0);
      setTotalBalance(total);
      setIsLoading(false);
    }, 1000);
  }, []);

  const toggleShowBalance = () => setShowBalance(!showBalance);

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-1/2" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg bg-gradient-to-br from-card to-secondary/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-headline">Total Balance</CardTitle>
          <Button variant="ghost" size="icon" onClick={toggleShowBalance} aria-label={showBalance ? "Hide balance" : "Show balance"}>
            {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </Button>
        </div>
        <CardDescription>Estimated value of all your assets.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-4xl font-bold text-primary">
            {showBalance ? `$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "•••••••••"}
          </p>
          {showBalance && (
            <p className="text-sm text-green-500 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" /> +2.5% (Past 24h)
            </p>
          )}
        </div>
        <div className="flex gap-4 mb-6">
          <Button className="flex-1" size="lg">
            <Download className="mr-2 h-5 w-5" /> Deposit
          </Button>
          <Button variant="outline" className="flex-1" size="lg">
            <Upload className="mr-2 h-5 w-5" /> Withdraw
          </Button>
        </div>
        {showBalance && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Asset Breakdown:</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {mockBalances.map(asset => (
                <div key={asset.asset} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-muted/50">
                   <div className="flex items-center gap-2">
                    {asset.iconUrl && (
                        <Image
                            src={asset.iconUrl}
                            alt={asset.asset}
                            width={20}
                            height={20}
                            className="rounded-full"
                            data-ai-hint={`${asset.asset} icon`}
                        />
                    )}
                    <span>{asset.asset}</span>
                  </div>
                  <div className="text-right">
                    <p>{asset.balance.toLocaleString(undefined, { maximumFractionDigits: 5 })}</p>
                    <p className="text-xs text-muted-foreground">${asset.usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
