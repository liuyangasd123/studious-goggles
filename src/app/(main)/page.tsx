import { MarketTable } from "@/components/market/MarketTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TrendingUp, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-2">
            <CardTitle className="text-3xl font-headline text-primary">Welcome to TradeWave</CardTitle>
            <CardDescription className="text-lg">Your gateway to the future of finance. Start trading today!</CardDescription>
          </div>
          <Zap className="h-12 w-12 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Explore a wide range of cryptocurrencies, trade with advanced tools, and manage your portfolio seamlessly.
            Our platform offers real-time data, secure transactions, and a user-friendly experience.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild className="text-base py-6 px-8">
              <Link href="/trade/BTC-USDT">
                Start Trading <TrendingUp className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-base py-6 px-8">
              <Link href="/charts/BTC-USDT">View Charts</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-headline font-semibold mb-4">Market Overview</h2>
        <MarketTable />
      </div>
    </div>
  );
}
