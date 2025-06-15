import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useEffect, useState } from 'react';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface KLineChartProps {
  symbol: string;
  timeframe: string;
  onPriceUpdate?: (price: number) => void;
}

export default function KLineChart({ symbol, timeframe, onPriceUpdate }: KLineChartProps) {
  const [chartHTML, setChartHTML] = useState('');

  useEffect(() => {
    generateChartHTML();
  }, [symbol, timeframe]);

  const generateChartHTML = () => {
    const html = `
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
            font-family: 'Inter', Arial, sans-serif;
            overflow: hidden;
        }
        #chart-container {
            width: 100vw;
            height: 100vh;
            position: relative;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
        }
        .price-info {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 1000;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px;
            border-radius: 6px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .price-value {
            color: #00D4AA;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 4px;
        }
        .price-change {
            color: #00D4AA;
            font-size: 12px;
            font-weight: 500;
        }
        .price-change.negative {
            color: #FF4757;
        }
        #trading-chart {
            width: 100%;
            height: 100%;
            background: transparent;
        }
        .chart-grid {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.1;
            pointer-events: none;
        }
        .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #00D4AA;
            font-size: 16px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div id="chart-container">
        <div class="price-info">
            <div class="price-value" id="current-price">$43,250.50</div>
            <div class="price-change" id="price-change">+$1,250.30 (+2.98%)</div>
        </div>
        <div class="loading" id="loading">Initializing Chart...</div>
        <canvas id="trading-chart"></canvas>
    </div>

    <script>
        class KLineChart {
            constructor() {
                this.canvas = document.getElementById('trading-chart');
                this.ctx = this.canvas.getContext('2d');
                this.data = [];
                this.currentPrice = 43250.50;
                this.timeframe = '${timeframe}';
                this.symbol = '${symbol}';
                
                this.setupCanvas();
                this.generateInitialData();
                this.startRealtimeUpdates();
                
                // Hide loading after initialization
                setTimeout(() => {
                    document.getElementById('loading').style.display = 'none';
                }, 1000);
            }
            
            setupCanvas() {
                const dpr = window.devicePixelRatio || 1;
                const rect = this.canvas.getBoundingClientRect();
                
                this.canvas.width = rect.width * dpr;
                this.canvas.height = rect.height * dpr;
                this.canvas.style.width = rect.width + 'px';
                this.canvas.style.height = rect.height + 'px';
                
                this.ctx.scale(dpr, dpr);
                this.width = rect.width;
                this.height = rect.height;
                
                // Responsive canvas
                window.addEventListener('resize', () => {
                    this.setupCanvas();
                    this.render();
                });
            }
            
            generateInitialData() {
                const now = Date.now();
                const intervals = {
                    '1M': 60000,
                    '5M': 300000,
                    '15M': 900000,
                    '30M': 1800000,
                    '1H': 3600000,
                    '4H': 14400000,
                    '1D': 86400000,
                    '1W': 604800000
                };
                
                const interval = intervals[this.timeframe] || 3600000;
                const dataPoints = Math.min(100, Math.floor(this.width / 8));
                
                for (let i = dataPoints; i >= 0; i--) {
                    const timestamp = now - (i * interval);
                    const volatility = this.currentPrice * 0.02; // 2% volatility
                    
                    const open = this.currentPrice + (Math.random() - 0.5) * volatility;
                    const close = open + (Math.random() - 0.5) * volatility * 0.8;
                    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
                    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
                    const volume = Math.random() * 1000 + 100;
                    
                    this.data.push({
                        timestamp,
                        open,
                        high,
                        low,
                        close,
                        volume
                    });
                }
                
                this.currentPrice = this.data[this.data.length - 1].close;
                this.render();
            }
            
            updatePrice() {
                const volatility = this.currentPrice * 0.001; // 0.1% volatility per update
                const change = (Math.random() - 0.5) * volatility;
                this.currentPrice += change;
                
                // Update latest candle or add new one
                const now = Date.now();
                const lastCandle = this.data[this.data.length - 1];
                const intervals = {
                    '1M': 60000,
                    '5M': 300000,
                    '15M': 900000,
                    '30M': 1800000,
                    '1H': 3600000,
                    '4H': 14400000,
                    '1D': 86400000,
                    '1W': 604800000
                };
                
                const interval = intervals[this.timeframe] || 3600000;
                
                if (now - lastCandle.timestamp >= interval) {
                    // Create new candle
                    const newCandle = {
                        timestamp: now,
                        open: lastCandle.close,
                        high: Math.max(lastCandle.close, this.currentPrice),
                        low: Math.min(lastCandle.close, this.currentPrice),
                        close: this.currentPrice,
                        volume: Math.random() * 1000 + 100
                    };
                    
                    this.data.push(newCandle);
                    
                    // Keep only last 100 candles
                    if (this.data.length > 100) {
                        this.data.shift();
                    }
                } else {
                    // Update current candle
                    lastCandle.close = this.currentPrice;
                    lastCandle.high = Math.max(lastCandle.high, this.currentPrice);
                    lastCandle.low = Math.min(lastCandle.low, this.currentPrice);
                    lastCandle.volume += Math.random() * 10;
                }
                
                this.updatePriceDisplay(change);
                this.render();
                
                // Send price update to React Native
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'priceUpdate',
                        price: this.currentPrice,
                        change: change,
                        symbol: this.symbol
                    }));
                }
            }
            
            updatePriceDisplay(change) {
                const priceElement = document.getElementById('current-price');
                const changeElement = document.getElementById('price-change');
                
                priceElement.textContent = '$' + this.currentPrice.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                
                const changePercent = (change / (this.currentPrice - change)) * 100;
                const changeText = change >= 0 ? '+' : '';
                
                changeElement.textContent = changeText + '$' + change.toFixed(2) + 
                    ' (' + changeText + changePercent.toFixed(2) + '%)';
                changeElement.className = 'price-change' + (change >= 0 ? '' : ' negative');
            }
            
            render() {
                if (!this.data.length) return;
                
                // Clear canvas
                this.ctx.clearRect(0, 0, this.width, this.height);
                
                // Calculate price range
                const prices = this.data.flatMap(d => [d.high, d.low]);
                const maxPrice = Math.max(...prices);
                const minPrice = Math.min(...prices);
                const priceRange = maxPrice - minPrice;
                const padding = priceRange * 0.1;
                
                const chartTop = 40;
                const chartBottom = this.height - 80;
                const chartHeight = chartBottom - chartTop;
                const chartLeft = 50;
                const chartRight = this.width - 20;
                const chartWidth = chartRight - chartLeft;
                
                // Draw grid
                this.drawGrid(chartLeft, chartTop, chartWidth, chartHeight, maxPrice + padding, minPrice - padding);
                
                // Draw candles
                const candleWidth = Math.max(2, chartWidth / this.data.length - 2);
                const candleSpacing = chartWidth / this.data.length;
                
                this.data.forEach((candle, index) => {
                    const x = chartLeft + index * candleSpacing;
                    this.drawCandle(candle, x, candleWidth, chartTop, chartHeight, maxPrice + padding, minPrice - padding);
                });
                
                // Draw volume
                this.drawVolume(chartLeft, chartBottom + 10, chartWidth, 60);
                
                // Draw price labels
                this.drawPriceLabels(chartRight + 5, chartTop, chartHeight, maxPrice + padding, minPrice - padding);
            }
            
            drawGrid(left, top, width, height, maxPrice, minPrice) {
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                this.ctx.lineWidth = 1;
                
                // Horizontal lines
                for (let i = 0; i <= 10; i++) {
                    const y = top + (height / 10) * i;
                    this.ctx.beginPath();
                    this.ctx.moveTo(left, y);
                    this.ctx.lineTo(left + width, y);
                    this.ctx.stroke();
                }
                
                // Vertical lines
                for (let i = 0; i <= 10; i++) {
                    const x = left + (width / 10) * i;
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, top);
                    this.ctx.lineTo(x, top + height);
                    this.ctx.stroke();
                }
            }
            
            drawCandle(candle, x, width, chartTop, chartHeight, maxPrice, minPrice) {
                const priceRange = maxPrice - minPrice;
                
                const openY = chartTop + chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight;
                const closeY = chartTop + chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;
                const highY = chartTop + chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
                const lowY = chartTop + chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;
                
                const isGreen = candle.close > candle.open;
                const color = isGreen ? '#00D4AA' : '#FF4757';
                
                // Draw wick
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(x + width / 2, highY);
                this.ctx.lineTo(x + width / 2, lowY);
                this.ctx.stroke();
                
                // Draw body
                this.ctx.fillStyle = color;
                const bodyTop = Math.min(openY, closeY);
                const bodyHeight = Math.max(Math.abs(closeY - openY), 1);
                this.ctx.fillRect(x, bodyTop, width, bodyHeight);
                
                // Add glow effect for recent candles
                if (this.data.indexOf(candle) >= this.data.length - 5) {
                    this.ctx.shadowColor = color;
                    this.ctx.shadowBlur = 5;
                    this.ctx.fillRect(x, bodyTop, width, bodyHeight);
                    this.ctx.shadowBlur = 0;
                }
            }
            
            drawVolume(left, top, width, height) {
                const maxVolume = Math.max(...this.data.map(d => d.volume));
                const volumeSpacing = width / this.data.length;
                const volumeWidth = Math.max(1, volumeSpacing - 1);
                
                this.data.forEach((candle, index) => {
                    const x = left + index * volumeSpacing;
                    const barHeight = (candle.volume / maxVolume) * height;
                    const isGreen = candle.close > candle.open;
                    
                    this.ctx.fillStyle = isGreen ? 'rgba(0, 212, 170, 0.3)' : 'rgba(255, 71, 87, 0.3)';
                    this.ctx.fillRect(x, top + height - barHeight, volumeWidth, barHeight);
                });
            }
            
            drawPriceLabels(x, top, height, maxPrice, minPrice) {
                this.ctx.fillStyle = '#a0a0a0';
                this.ctx.font = '10px Inter, Arial, sans-serif';
                this.ctx.textAlign = 'left';
                
                for (let i = 0; i <= 5; i++) {
                    const price = maxPrice - ((maxPrice - minPrice) / 5) * i;
                    const y = top + (height / 5) * i;
                    
                    this.ctx.fillText('$' + price.toFixed(2), x, y + 3);
                }
            }
            
            startRealtimeUpdates() {
                // Update every 2 seconds for demo purposes
                setInterval(() => {
                    this.updatePrice();
                }, 2000);
                
                // More frequent updates for smoother animation
                setInterval(() => {
                    this.render();
                }, 100);
            }
        }
        
        // Initialize chart when page loads
        window.addEventListener('load', () => {
            new KLineChart();
        });
    </script>
</body>
</html>
    `;
    
    setChartHTML(html);
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'priceUpdate' && onPriceUpdate) {
        onPriceUpdate(data.price);
      }
    } catch (error) {
      console.log('Chart message error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: chartHTML }}
        style={styles.webView}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={false}
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});