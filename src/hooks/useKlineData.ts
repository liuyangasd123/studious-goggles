"use client";

import { useState, useEffect, useCallback } from 'react';
import type { KlineDataPoint} from '@/lib/mock-data';
import { generateInitialKlineData, updateKlineData as updateDataLogic } from '@/lib/mock-data';

export function useKlineData(pair: string, initialTimeframeMinutes: number = 1, initialPoints: number = 100) {
  const [klineData, setKlineData] = useState<KlineDataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<number>(initialTimeframeMinutes);
  const [isLoading, setIsLoading] = useState(true);

  const initializeData = useCallback(() => {
    setIsLoading(true);
    const initialData = generateInitialKlineData(pair, initialPoints, timeframe);
    setKlineData(initialData);
    setIsLoading(false);
  }, [pair, initialPoints, timeframe]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    // Simulate WebSocket updates
    const intervalId = setInterval(() => {
      setKlineData(prevData => updateDataLogic(prevData, timeframe));
    }, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, [timeframe]);
  
  const changeTimeframe = useCallback((newTimeframeMinutes: number) => {
    setTimeframe(newTimeframeMinutes);
    // Re-initialize data for the new timeframe
    setIsLoading(true);
    const initialData = generateInitialKlineData(pair, initialPoints, newTimeframeMinutes);
    setKlineData(initialData);
    setIsLoading(false);
  }, [pair, initialPoints]);


  return { klineData, isLoading, timeframe, changeTimeframe };
}
