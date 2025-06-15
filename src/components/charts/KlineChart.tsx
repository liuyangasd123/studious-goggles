"use client";

import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { KlineDataPoint } from '@/lib/mock-data';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface KlineChartProps {
  data: KlineDataPoint[];
  pair: string;
  isLoading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string | number;
}

const CustomTooltipContent: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Time</span>
            <span className="font-bold text-muted-foreground">
              {format(new Date(data.time * 1000), 'HH:mm:ss dd/MM/yy')}
            </span>
          </div>
           <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Volume</span>
            <span className="font-bold text-foreground">{data.volume?.toFixed(2) ?? 'N/A'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Open</span>
            <span className="font-bold text-foreground">{data.open}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">High</span>
            <span className="font-bold text-foreground">{data.high}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Low</span>
            <span className="font-bold text-foreground">{data.low}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Close</span>
            <span className="font-bold text-foreground">{data.close}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};


interface CandlestickProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  low?: number;
  high?: number;
  open?: number;
  close?: number;
  fill?: string; // Not directly used, color is determined by open/close
  payload?: KlineDataPoint; // The original data point
  yAxis?: any; // To access the scale function
}


const CandlestickShape: React.FC<CandlestickProps> = (props) => {
  const { x = 0, y = 0, width = 0, payload, yAxis } = props;

  if (!payload || !yAxis) return null;

  const { open, high, low, close } = payload;

  const isUp = close >= open;
  const color = isUp ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-1))'; // Green for up, Red for down

  // Calculate coordinates using the YAxis scale
  const yHigh = yAxis.scale(high);
  const yLow = yAxis.scale(low);
  const yOpen = yAxis.scale(open);
  const yClose = yAxis.scale(close);

  const bodyTop = Math.min(yOpen, yClose);
  const bodyHeight = Math.abs(yOpen - yClose);
  
  // Ensure minimum height for visibility if open and close are too close
  const minBodyHeight = 0.5; 
  const actualBodyHeight = Math.max(bodyHeight, minBodyHeight);


  return (
    <g>
      {/* Wick */}
      <line x1={x + width / 2} y1={yHigh} x2={x + width / 2} y2={yLow} stroke={color} strokeWidth={1.5} />
      {/* Body */}
      <rect x={x} y={bodyTop} width={width} height={actualBodyHeight} fill={color} />
    </g>
  );
};


export function KlineChart({ data, pair, isLoading }: KlineChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent className="h-[400px] md:h-[500px]">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{pair} Chart</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] md:h-[500px] flex items-center justify-center">
          <p>No data available for {pair}.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate domain for Y-axis to give some padding
  const prices = data.flatMap(d => [d.high, d.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const pricePadding = (maxPrice - minPrice) * 0.1; // 10% padding

  return (
    <ResponsiveContainer width="100%" height={500}>
      <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="time"
          tickFormatter={(unixTime) => format(new Date(unixTime * 1000), 'HH:mm')}
          stroke="hsl(var(--muted-foreground))"
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={{ stroke: 'hsl(var(--border))' }}
        />
        <YAxis
          orientation="right"
          domain={[minPrice - pricePadding, maxPrice + pricePadding]}
          tickFormatter={(value) => `$${value.toFixed(2)}`}
          stroke="hsl(var(--muted-foreground))"
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={{ stroke: 'hsl(var(--border))' }}
          width={70}
        />
        <Tooltip content={<CustomTooltipContent />} cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1, strokeDasharray: '3 3' }}/>
        <Bar dataKey="close" shape={<CandlestickShape />} />
         {data.length > 0 && (
          <ReferenceLine 
            y={data[data.length - 1].close} 
            stroke="hsl(var(--accent))" 
            strokeDasharray="4 4"
            strokeWidth={1.5}
          >
             <Legend content={<CurrentPriceLegend price={data[data.length - 1].close} />} verticalAlign="top" align="left" wrapperStyle={{paddingLeft: '10px', paddingTop: '5px'}}/>
          </ReferenceLine>
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

const CurrentPriceLegend = ({ price }: { price: number }) => {
  return (
    <div className="flex items-center text-xs text-accent">
      <div className="w-3 h-px bg-accent mr-2"></div>
      Current Price: ${price.toFixed(2)}
    </div>
  );
};
