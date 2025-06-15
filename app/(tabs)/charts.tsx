import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import { TrendingUp, TrendingDown, ChartBar as BarChart, Activity, Maximize2 } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export default function Charts() {
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [currentPrice, setCurrentPrice] = useState(43250.50);
  const [priceChange, setPriceChange] = useState(1250.30);
  const [priceChangePercent, setPriceChangePercent] = useState(2.98);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const timeframes = ['1M', '5M', '15M', '30M', '1H', '4H', '1D', '1W'];
  const tradingPairs = [
    { symbol: 'BTC/USDT', price: 43250.50, change: 2.98 },
    { symbol: 'ETH/USDT', price: 2650.80, change: -3.25 },
    { symbol: 'BNB/USDT', price: 315.45, change: 4.18 },
    { symbol: 'ADA/USDT', price: 0.48, change: 5.49 },
    { symbol: 'SOL/USDT', price: 98.75, change: -4.19 },
  ];

  // Generate TradingView HTML with WebSocket simulation
  const generateTradingViewHTML = () => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #0a0a0a;
            font-family: Arial, sans-serif;
        }
        #tradingview_chart {
            width: 100%;
            height: 100vh;
            background-color: #0a0a0a;
        }
        .chart-container {
            position: relative;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
        }
        .price-info {
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 10;
            color: white;
            background: rgba(0, 0, 0, 0.7);
            padding: 15px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
        }
        .price-value {
            font-size: 24px;
            font-weight: bold;
            color: #00D4AA;
            margin-bottom: 5px;
        }
        .price-change {
            font-size: 14px;
            color: #00D4AA;
        }
        .price-change.negative {
            color: #FF4757;
        }
        .chart-area {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 19px,
                rgba(255, 255, 255, 0.03) 20px
            ),
            repeating-linear-gradient(
                90deg,
                transparent,
                transparent 49px,
                rgba(255, 255, 255, 0.03) 50px
            );
        }
        .candlestick {
            position: absolute;
            width: 8px;
            background: #00D4AA;
            transition: all 0.3s ease;
        }
        .candlestick.red {
            background: #FF4757;
        }
        .candlestick-wick {
            position: absolute;
            width: 1px;
            background: #666;
            left: 50%;
            transform: translateX(-50%);
        }
        .volume-bar {
            position: absolute;
            bottom: 0;
            width: 8px;
            background: rgba(0, 212, 170, 0.3);
            transition: all 0.3s ease;
        }
        .volume-bar.red {
            background: rgba(255, 71, 87, 0.3);
        }
    </style>
</head>
<body>
    <div class="chart-container">
        <div class="price-info">
            <div class="price-value" id="currentPrice">$43,250.50</div>
            <div class="price-change" id="priceChange">+$1,250.30 (+2.98%)</div>
        </div>
        <canvas id="chartCanvas" width="800" height="600"></canvas>
    </div>

    <script>
        let currentPrice = 43250.50;
        let priceHistory = [];
        let candleData = [];
        
        // Initialize canvas
        const canvas = document.getElementById('chartCanvas');
        const ctx = canvas.getContext('2d');
        
        // Resize canvas to full screen
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        // Generate initial candle data
        function generateInitialData() {
            const now = Date.now();
            for (let i = 100; i >= 0; i--) {
                const timestamp = now - (i * 60000); // 1 minute intervals
                const open = currentPrice + (Math.random() - 0.5) * 100;
                const close = open + (Math.random() - 0.5) * 50;
                const high = Math.max(open, close) + Math.random() * 30;
                const low = Math.min(open, close) - Math.random() * 30;
                const volume = Math.random() * 1000;
                
                candleData.push({
                    timestamp,
                    open,
                    high,
                    low,
                    close,
                    volume
                });
            }
        }
        
        // Draw candlestick chart
        function drawChart() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw grid
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            
            // Horizontal lines
            for (let i = 0; i < 20; i++) {
                const y = (canvas.height / 20) * i;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
            
            // Vertical lines
            for (let i = 0; i < 30; i++) {
                const x = (canvas.width / 30) * i;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            
            // Calculate price range
            const prices = candleData.map(d => [d.high, d.low]).flat();
            const maxPrice = Math.max(...prices);
            const minPrice = Math.min(...prices);
            const priceRange = maxPrice - minPrice;
            
            // Draw candlesticks
            const candleWidth = Math.max(2, canvas.width / candleData.length - 2);
            const volumeHeight = canvas.height * 0.2;
            const chartHeight = canvas.height - volumeHeight;
            
            candleData.forEach((candle, index) => {
                const x = (canvas.width / candleData.length) * index;
                const openY = chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight;
                const closeY = chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;
                const highY = chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
                const lowY = chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;
                
                const isGreen = candle.close > candle.open;
                
                // Draw wick
                ctx.strokeStyle = isGreen ? '#00D4AA' : '#FF4757';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x + candleWidth / 2, highY);
                ctx.lineTo(x + candleWidth / 2, lowY);
                ctx.stroke();
                
                // Draw body
                ctx.fillStyle = isGreen ? '#00D4AA' : '#FF4757';
                const bodyTop = Math.min(openY, closeY);
                const bodyHeight = Math.abs(closeY - openY);
                ctx.fillRect(x, bodyTop, candleWidth, Math.max(bodyHeight, 1));
                
                // Draw volume
                const volumeBarHeight = (candle.volume / 1000) * volumeHeight;
                ctx.fillStyle = isGreen ? 'rgba(0, 212, 170, 0.3)' : 'rgba(255, 71, 87, 0.3)';
                ctx.fillRect(x, canvas.height - volumeBarHeight, candleWidth, volumeBarHeight);
            });
        }
        
        // Update price and add new candle
        function updatePrice() {
            const change = (Math.random() - 0.5) * 20;
            currentPrice += change;
            
            // Add new candle data
            const lastCandle = candleData[candleData.length - 1];
            const now = Date.now();
            
            if (now - lastCandle.timestamp > 60000) { // New minute
                const newCandle = {
                    timestamp: now,
                    open: lastCandle.close,
                    high: lastCandle.close + Math.random() * 30,
                    low: lastCandle.close - Math.random() * 30,
                    close: currentPrice,
                    volume: Math.random() * 1000
                };
                
                candleData.push(newCandle);
                if (candleData.length > 100) {
                    candleData.shift();
                }
            } else {
                // Update current candle
                candleData[candleData.length - 1].close = currentPrice;
                candleData[candleData.length - 1].high = Math.max(candleData[candleData.length - 1].high, currentPrice);
                candleData[candleData.length - 1].low = Math.min(candleData[candleData.length - 1].low, currentPrice);
            }
            
            // Update price display
            document.getElementById('currentPrice').textContent = '$' + currentPrice.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            
            const changePercent = (change / (currentPrice - change)) * 100;
            const changeText = change >= 0 ? '+' : '';
            document.getElementById('priceChange').textContent = 
                changeText + '$' + change.toFixed(2) + ' (' + changeText + changePercent.toFixed(2) + '%)';
            document.getElementById('priceChange').className = 'price-change' + (change >= 0 ? '' : ' negative');
            
            drawChart();
        }
        
        // Initialize
        generateInitialData();
        drawChart();
        
        // Update every 2 seconds
        setInterval(updatePrice, 2000);
        
        // Send price updates to React Native
        function sendPriceUpdate() {
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'priceUpdate',
                    price: currentPrice,
                    change: priceHistory.length > 1 ? currentPrice - priceHistory[priceHistory.length - 2] : 0
                }));
            }
        }
        
        setInterval(sendPriceUpdate, 1000);
    </script>
</body>
</html>
    `;
  };

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 20;
      setCurrentPrice(prev => {
        const newPrice = prev + change;
        setPriceChange(change);
        setPriceChangePercent((change / prev) * 100);
        return newPrice;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price < 1) {
      return `$${price.toFixed(4)}`;
    }
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'priceUpdate') {
        setCurrentPrice(data.price);
        setPriceChange(data.change);
      }
    } catch (error) {
      console.log('WebView message error:', error);
    }
  };

  return (
    <LinearGradient
      colors={['#0a0a0a', '#1a1a1a']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.pairInfo}>
          <Text style={styles.selectedPair}>{selectedPair}</Text>
          <Text style={styles.currentPrice}>{formatPrice(currentPrice)}</Text>
          <View style={styles.priceChange}>
            {priceChangePercent >= 0 ? (
              <TrendingUp size={12} color="#00D4AA" />
            ) : (
              <TrendingDown size={12} color="#FF4757" />
            )}
            <Text style={[
              styles.priceChangeText,
              { color: priceChangePercent >= 0 ? '#00D4AA' : '#FF4757' }
            ]}>
              {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.fullscreenButton}
          onPress={() => setIsFullscreen(!isFullscreen)}
        >
          <Maximize2 size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Timeframe Selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.timeframeSelector}
        contentContainerStyle={styles.timeframeSelectorContent}
      >
        {timeframes.map(timeframe => (
          <TouchableOpacity
            key={timeframe}
            style={[
              styles.timeframeButton,
              selectedTimeframe === timeframe && styles.activeTimeframe
            ]}
            onPress={() => setSelectedTimeframe(timeframe)}
          >
            <Text style={[
              styles.timeframeText,
              selectedTimeframe === timeframe && styles.activeTimeframeText
            ]}>
              {timeframe}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Chart */}
      <View style={[styles.chartContainer, isFullscreen && styles.fullscreenChart]}>
        <WebView
          source={{ html: generateTradingViewHTML() }}
          style={styles.webView}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          scrollEnabled={false}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {!isFullscreen && (
        <ScrollView style={styles.bottomContent} showsVerticalScrollIndicator={false}>
          {/* Trading Pairs */}
          <View style={styles.tradingPairsContainer}>
            <Text style={styles.sectionTitle}>Trading Pairs</Text>
            {tradingPairs.map((pair, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.pairItem,
                  selectedPair === pair.symbol && styles.activePairItem
                ]}
                onPress={() => setSelectedPair(pair.symbol)}
              >
                <View style={styles.pairLeft}>
                  <Text style={styles.pairSymbol}>{pair.symbol}</Text>
                  <Text style={styles.pairPrice}>{formatPrice(pair.price)}</Text>
                </View>
                <View style={styles.pairRight}>
                  <View style={styles.pairChange}>
                    {pair.change >= 0 ? (
                      <TrendingUp size={12} color="#00D4AA" />
                    ) : (
                      <TrendingDown size={12} color="#FF4757" />
                    )}
                    <Text style={[
                      styles.pairChangeText,
                      { color: pair.change >= 0 ? '#00D4AA' : '#FF4757' }
                    ]}>
                      {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}%
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Market Stats */}
          <View style={styles.marketStatsContainer}>
            <Text style={styles.sectionTitle}>Market Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>24h High</Text>
                <Text style={styles.statValue}>{formatPrice(currentPrice * 1.05)}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>24h Low</Text>
                <Text style={styles.statValue}>{formatPrice(currentPrice * 0.95)}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>24h Volume</Text>
                <Text style={styles.statValue}>28.5K BTC</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Market Cap</Text>
                <Text style={styles.statValue}>$847.2B</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 16,
  },
  pairInfo: {
    flex: 1,
  },
  selectedPair: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  currentPrice: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginTop: 4,
  },
  priceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  priceChangeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  fullscreenButton: {
    padding: 8,
  },
  timeframeSelector: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  timeframeSelectorContent: {
    gap: 8,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
  },
  activeTimeframe: {
    backgroundColor: '#00D4AA',
  },
  timeframeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#a0a0a0',
  },
  activeTimeframeText: {
    color: '#ffffff',
  },
  chartContainer: {
    height: 300,
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
  },
  fullscreenChart: {
    height: '60%',
    marginHorizontal: 0,
    borderRadius: 0,
  },
  webView: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  bottomContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  tradingPairsContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  pairItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  activePairItem: {
    backgroundColor: '#00D4AA20',
  },
  pairLeft: {
    flex: 1,
  },
  pairSymbol: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  pairPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a0a0a0',
    marginTop: 4,
  },
  pairRight: {
    alignItems: 'flex-end',
  },
  pairChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pairChangeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  marketStatsContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a0a0a0',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});