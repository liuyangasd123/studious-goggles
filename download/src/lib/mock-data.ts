
export interface MarketAsset {
  id: string;
  name: string;
  pair: string;
  price: number;
  change24h: number;
  volume24h: number;
  sparkline: number[];
  iconUrl?: string;
}

export interface KlineDataPoint {
  time: number; // Unix timestamp (seconds)
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export const marketAssets: Omit<MarketAsset, 'price' | 'change24h' | 'sparkline' | 'volume24h'>[] = [
  { id: "bitcoin", name: "Bitcoin", pair: "BTC/USDT" , iconUrl: "https://placehold.co/32x32.png"},
  { id: "ethereum", name: "Ethereum", pair: "ETH/USDT", iconUrl: "https://placehold.co/32x32.png" },
  { id: "solana", name: "Solana", pair: "SOL/USDT", iconUrl: "https://placehold.co/32x32.png" },
  { id: "dogecoin", name: "Dogecoin", pair: "DOGE/USDT", iconUrl: "https://placehold.co/32x32.png" },
  { id: "cardano", name: "Cardano", pair: "ADA/USDT", iconUrl: "https://placehold.co/32x32.png" },
];

export function generateInitialMarketData(): MarketAsset[] {
  return marketAssets.map(asset => {
    const basePrice = asset.id === 'bitcoin' ? 60000 : asset.id === 'ethereum' ? 3000 : asset.id === 'solana' ? 150 : asset.id === 'dogecoin' ? 0.15 : 0.5;
    const price = parseFloat((basePrice * (1 + (Math.random() - 0.5) * 0.1)).toFixed(asset.id === 'dogecoin' ? 4: 2));
    const change24h = parseFloat(((Math.random() - 0.5) * 10).toFixed(2)); // percentage
    const volume24h = parseFloat((Math.random() * 100000000).toFixed(0));
    const sparkline = Array.from({ length: 30 }, () => parseFloat((price * (1 + (Math.random() - 0.5) * 0.05)).toFixed(2)));
    return {
      ...asset,
      price,
      change24h,
      volume24h,
      sparkline,
    };
  });
}

export function updateMarketData(currentData: MarketAsset[]): MarketAsset[] {
  return currentData.map(asset => {
    const priceChangeFactor = (Math.random() - 0.5) * 0.01; // Max 0.5% change per tick
    let newPrice = asset.price * (1 + priceChangeFactor);
    newPrice = parseFloat(newPrice.toFixed(asset.id === 'dogecoin' ? 4 : 2));

    const newChange24h = parseFloat((asset.change24h + (Math.random() - 0.5) * 0.1).toFixed(2));
    
    const newSparkline = [...asset.sparkline.slice(1), newPrice];

    return {
      ...asset,
      price: newPrice,
      change24h: newChange24h,
      sparkline: newSparkline,
      volume24h: asset.volume24h + Math.random() * 1000,
    };
  });
}


export function generateInitialKlineData(pair: string, points: number = 100, timeframeMinutes: number = 1): KlineDataPoint[] {
  const data: KlineDataPoint[] = [];
  let lastClose = pair.startsWith('BTC') ? 60000 : pair.startsWith('ETH') ? 3000 : 150;
  let currentTime = Math.floor(Date.now() / 1000) - points * timeframeMinutes * 60;

  for (let i = 0; i < points; i++) {
    const open = lastClose;
    const change = (Math.random() - 0.5) * (lastClose * 0.02); // Max 2% change from open
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * (lastClose * 0.01); // Max 1% above max(open,close)
    const low = Math.min(open, close) - Math.random() * (lastClose * 0.01); // Max 1% below min(open,close)
    
    data.push({
      time: currentTime,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.random() * 100,
    });
    lastClose = close;
    currentTime += timeframeMinutes * 60;
  }
  return data;
}

export function updateKlineData(
  currentData: KlineDataPoint[],
  timeframeMinutes: number = 1
): KlineDataPoint[] {
  if (currentData.length === 0) return generateInitialKlineData("UNKNOWN", 1, timeframeMinutes);

  const lastCandle = currentData[currentData.length - 1];
  const now = Math.floor(Date.now() / 1000);
  const nextCandleTime = lastCandle.time + timeframeMinutes * 60;

  let newCandle: KlineDataPoint;

  if (now >= nextCandleTime) {
    // Start a new candle
    const open = lastCandle.close;
    const change = (Math.random() - 0.5) * (open * 0.01); // Smaller change for new candle ticks
    const close = open + change;
    newCandle = {
      time: nextCandleTime,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(Math.max(open, close).toFixed(2)),
      low: parseFloat(Math.min(open, close).toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.random() * 10,
    };
    return [...currentData.slice(currentData.length > 200 ? 1 : 0), newCandle]; // Keep max 200 points
  } else {
    // Update current candle
    const updatedLastCandle = { ...lastCandle };
    const priceMove = (Math.random() - 0.5) * (lastCandle.close * 0.005); // Smaller move for intra-candle ticks
    updatedLastCandle.close = parseFloat((lastCandle.close + priceMove).toFixed(2));
    updatedLastCandle.high = parseFloat(Math.max(lastCandle.high, updatedLastCandle.close).toFixed(2));
    updatedLastCandle.low = parseFloat(Math.min(lastCandle.low, updatedLastCandle.close).toFixed(2));
    updatedLastCandle.volume = (lastCandle.volume || 0) + Math.random() * 5;
    
    const newData = [...currentData];
    newData[newData.length - 1] = updatedLastCandle;
    return newData;
  }
}

export const defaultPair = "BTC-USDT";
export const availablePairs = ["BTC-USDT", "ETH-USDT", "SOL-USDT", "DOGE-USDT", "ADA-USDT"];

export const timeframes = [
  { label: "1m", value: 1 },
  { label: "5m", value: 5 },
  { label: "15m", value: 15 },
  { label: "1H", value: 60 },
  { label: "4H", value: 240 },
  { label: "1D", value: 1440 },
];
