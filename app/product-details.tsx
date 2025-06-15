import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, TrendingUp, TrendingDown, Star, Share, MoveHorizontal as MoreHorizontal, Activity, Volume2, DollarSign, ChartBar as BarChart3 } from 'lucide-react-native';
import KLineChart from '@/components/KLineChart';

const { width: screenWidth } = Dimensions.get('window');

export default function ProductDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [currentPrice, setCurrentPrice] = useState(parseFloat(params.price as string) || 43250.50);
  const [priceChange, setPriceChange] = useState(parseFloat(params.changePercent as string) || 2.98);
  const [isFavorite, setIsFavorite] = useState(false);

  const timeframes = ['1M', '5M', '15M', '30M', '1H', '4H', '1D', '1W'];
  
  const productInfo = {
    id: params.id as string,
    symbol: params.symbol as string,
    name: params.name as string,
    price: currentPrice,
    changePercent: priceChange,
    volume: parseFloat(params.volume as string) || 0,
    high24h: parseFloat(params.high24h as string) || 0,
    low24h: parseFloat(params.low24h as string) || 0,
    marketCap: parseFloat(params.marketCap as string) || 0,
  };

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 20;
      setCurrentPrice(prev => {
        const newPrice = prev + change;
        setPriceChange((change / prev) * 100);
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

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `$${(volume / 1000000000).toFixed(1)}B`;
    }
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    }
    return `$${volume.toLocaleString()}`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(1)}B`;
    }
    if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(1)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  const handlePriceUpdate = (newPrice: number) => {
    setCurrentPrice(newPrice);
  };

  const handleTrade = (type: 'buy' | 'sell') => {
    router.push({
      pathname: '/(tabs)/trading',
      params: {
        symbol: productInfo.symbol,
        price: currentPrice.toString(),
        action: type,
      }
    });
  };

  return (
    <LinearGradient
      colors={['#0a0a0a', '#1a1a1a']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerSymbol}>{productInfo.symbol}</Text>
          <Text style={styles.headerName}>{productInfo.name}</Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Star 
              size={20} 
              color={isFavorite ? "#FFD700" : "#ffffff"} 
              fill={isFavorite ? "#FFD700" : "transparent"}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Share size={20} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MoreHorizontal size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Price Section */}
        <View style={styles.priceSection}>
          <Text style={styles.currentPrice}>{formatPrice(currentPrice)}</Text>
          <View style={styles.priceChangeContainer}>
            {priceChange >= 0 ? (
              <TrendingUp size={16} color="#00D4AA" />
            ) : (
              <TrendingDown size={16} color="#FF4757" />
            )}
            <Text style={[
              styles.priceChangeText,
              { color: priceChange >= 0 ? '#00D4AA' : '#FF4757' }
            ]}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </Text>
            <Text style={styles.priceChangeValue}>
              {priceChange >= 0 ? '+' : ''}${(currentPrice * priceChange / 100).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Market Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Activity size={16} color="#00D4AA" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>24h High</Text>
              <Text style={styles.statValue}>{formatPrice(productInfo.high24h)}</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Activity size={16} color="#FF4757" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>24h Low</Text>
              <Text style={styles.statValue}>{formatPrice(productInfo.low24h)}</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Volume2 size={16} color="#00D4AA" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>24h Volume</Text>
              <Text style={styles.statValue}>{formatVolume(productInfo.volume)}</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <DollarSign size={16} color="#00D4AA" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Market Cap</Text>
              <Text style={styles.statValue}>{formatMarketCap(productInfo.marketCap)}</Text>
            </View>
          </View>
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

        {/* K-Line Chart */}
        <View style={styles.chartContainer}>
          <KLineChart
            symbol={`${productInfo.symbol}/USDT`}
            timeframe={selectedTimeframe}
            onPriceUpdate={handlePriceUpdate}
          />
        </View>

        {/* Chart Analysis */}
        <View style={styles.analysisContainer}>
          <Text style={styles.analysisTitle}>Technical Analysis</Text>
          <View style={styles.analysisGrid}>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisLabel}>RSI (14)</Text>
              <Text style={[styles.analysisValue, { color: '#00D4AA' }]}>65.4</Text>
              <Text style={styles.analysisStatus}>Bullish</Text>
            </View>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisLabel}>MACD</Text>
              <Text style={[styles.analysisValue, { color: '#00D4AA' }]}>+124.5</Text>
              <Text style={styles.analysisStatus}>Buy Signal</Text>
            </View>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisLabel}>MA (20)</Text>
              <Text style={styles.analysisValue}>{formatPrice(currentPrice * 0.98)}</Text>
              <Text style={styles.analysisStatus}>Support</Text>
            </View>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisLabel}>Bollinger</Text>
              <Text style={[styles.analysisValue, { color: '#FF4757' }]}>Upper</Text>
              <Text style={styles.analysisStatus}>Resistance</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>About {productInfo.name}</Text>
          <Text style={styles.aboutText}>
            {productInfo.name} ({productInfo.symbol}) is a leading cryptocurrency that has shown significant growth and adoption in the digital asset space. 
            With its innovative technology and strong community support, it continues to be a popular choice among investors and traders worldwide.
          </Text>
        </View>
      </ScrollView>

      {/* Trading Actions */}
      <View style={styles.tradingActions}>
        <TouchableOpacity 
          style={[styles.tradingButton, styles.sellButton]}
          onPress={() => handleTrade('sell')}
        >
          <Text style={styles.tradingButtonText}>Sell {productInfo.symbol}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tradingButton, styles.buyButton]}
          onPress={() => handleTrade('buy')}
        >
          <Text style={styles.tradingButtonText}>Buy {productInfo.symbol}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerSymbol: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  headerName: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a0a0a0',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  priceSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  currentPrice: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  priceChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceChangeText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  priceChangeValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a0a0a0',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00D4AA20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a0a0a0',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
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
    height: 400,
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
    marginBottom: 24,
  },
  analysisContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  analysisTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  analysisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  analysisItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  analysisLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a0a0a0',
    marginBottom: 8,
  },
  analysisValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  analysisStatus: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#00D4AA',
    textTransform: 'uppercase',
  },
  aboutContainer: {
    marginHorizontal: 24,
    marginBottom: 100,
  },
  aboutTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a0a0a0',
    lineHeight: 20,
  },
  tradingActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: 12,
  },
  tradingButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#00D4AA',
  },
  sellButton: {
    backgroundColor: '#FF4757',
  },
  tradingButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});