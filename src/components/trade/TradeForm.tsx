"use client";

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const tradeSchema = z.object({
  price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({invalid_type_error: "Price must be a number"}).positive({ message: "Price must be positive" }).optional()
  ),
  amount: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({invalid_type_error: "Amount must be a number"}).positive({ message: "Amount must be positive" })
  ),
  total: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({invalid_type_error: "Total must be a number"}).positive({ message: "Total must be positive" }).optional()
  ),
  orderType: z.enum(["limit", "market"]),
  tradeType: z.enum(["buy", "sell"]),
  amountPercentage: z.number().min(0).max(100).optional(),
});

type TradeFormValues = z.infer<typeof tradeSchema>;

interface TradeFormProps {
  pair: string; // e.g. "BTC-USDT"
  currentPrice?: number; // Optional current price for prefill
}

export function TradeForm({ pair, currentPrice = 60000 }: TradeFormProps) {
  const { toast } = useToast();
  const [baseAsset, quoteAsset] = pair.split('-');
  const [activeTab, setActiveTab] = React.useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = React.useState<"limit" | "market">("limit");

  const form = useForm<TradeFormValues>({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      price: currentPrice,
      amount: undefined,
      total: undefined,
      orderType: "limit",
      tradeType: "buy",
      amountPercentage: 0,
    },
  });

  React.useEffect(() => {
    form.setValue("price", currentPrice);
  }, [currentPrice, form]);

  const handleSliderChange = (value: number[]) => {
    form.setValue("amountPercentage", value[0]);
    // Mock available balance and calculate amount based on percentage
    const mockBalance = activeTab === "buy" ? 10000 : 0.5; // 10000 USDT for buy, 0.5 BTC for sell
    const priceToUse = form.getValues("price") || currentPrice;
    
    let calculatedAmount;
    if (activeTab === "buy") { // Buying baseAsset with quoteAsset
      calculatedAmount = (mockBalance * (value[0] / 100)) / priceToUse;
    } else { // Selling baseAsset for quoteAsset
      calculatedAmount = mockBalance * (value[0] / 100);
    }
    form.setValue("amount", parseFloat(calculatedAmount.toFixed(6)));
    const total = calculatedAmount * priceToUse;
    form.setValue("total", parseFloat(total.toFixed(2)));
  };

  const watchAmount = form.watch("amount");
  const watchPrice = form.watch("price");

  React.useEffect(() => {
    if (watchAmount && watchPrice && orderType === "limit") {
      form.setValue("total", parseFloat((watchAmount * watchPrice).toFixed(2)));
    } else if (watchAmount && orderType === "market") {
      // For market order, total might be estimated or amount is primary
      form.setValue("total", parseFloat((watchAmount * currentPrice).toFixed(2))); // Estimate with current price
    }
  }, [watchAmount, watchPrice, orderType, currentPrice, form]);


  function onSubmit(values: TradeFormValues) {
    const finalValues = { ...values, tradeType: activeTab, orderType };
    console.log("Trade Submitted:", finalValues);
    toast({
      title: "Order Placed",
      description: `${finalValues.tradeType.toUpperCase()} ${finalValues.orderType.toUpperCase()} order for ${finalValues.amount} ${baseAsset} at ${finalValues.price ? `$${finalValues.price}` : 'Market Price'}.`,
      variant: finalValues.tradeType === "buy" ? "default" : "destructive", // Not ideal, but green/red for buy/sell
    });
    form.reset({ price: currentPrice, amount: undefined, total: undefined, orderType: orderType, tradeType: activeTab, amountPercentage: 0 });
  }

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <Tabs defaultValue="buy" onValueChange={(value) => setActiveTab(value as "buy" | "sell")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="buy" className="data-[state=active]:bg-green-500/80 data-[state=active]:text-white">Buy {baseAsset}</TabsTrigger>
            <TabsTrigger value="sell" className="data-[state=active]:bg-red-500/80 data-[state=active]:text-white">Sell {baseAsset}</TabsTrigger>
          </TabsList>
          
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="limit" onClick={() => setOrderType("limit")} className={orderType === "limit" ? "bg-primary/20" : ""}>Limit</TabsTrigger>
            <TabsTrigger value="market" onClick={() => setOrderType("market")} className={orderType === "market" ? "bg-primary/20" : ""}>Market</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {orderType === "limit" && (
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ({quoteAsset})</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder={`Price for ${baseAsset}`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
               {orderType === "market" && (
                 <FormItem>
                   <FormLabel>Price ({quoteAsset})</FormLabel>
                   <FormControl>
                     <Input type="text" value="Market Price" readOnly className="text-muted-foreground" />
                   </FormControl>
                 </FormItem>
               )}

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ({baseAsset})</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder={`Amount of ${baseAsset}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amountPercentage"
                render={({ field }) => (
                  <FormItem>
                     <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                    </div>
                    <FormControl>
                       <Slider
                        defaultValue={[0]}
                        max={100}
                        step={1}
                        onValueChange={handleSliderChange}
                        className={cn("w-full", activeTab === "buy" ? "[&>span:first-child]:bg-green-500" : "[&>span:first-child]:bg-red-500")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Total ({quoteAsset})</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    readOnly 
                    value={form.getValues("total") || ""} 
                    placeholder="Total cost" 
                    className="text-muted-foreground"
                   />
                </FormControl>
              </FormItem>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>Available: {activeTab === "buy" ? `10,000 ${quoteAsset}` : `0.5 ${baseAsset}`}</p>
                <p>Est. Fee: 0.1%</p>
              </div>

              <Button 
                type="submit" 
                className={`w-full text-lg py-3 ${activeTab === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Processing..." : `${activeTab === 'buy' ? 'Buy' : 'Sell'} ${baseAsset}`}
              </Button>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
