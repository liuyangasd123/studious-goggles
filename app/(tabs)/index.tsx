import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, Eye, EyeOff, Bell, Search } from 'lucide-react-native';

interface MarketData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  marketCap: number;
}

export default function Home() {
  const router = useRouter();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [marketData, setMarketData] = useState<MarketData[]>([
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 43250.50,
      change: 1250.30,
      changePercent: 2.98,
      volume: 28540000000,
      high24h: 44100.00,
      low24h: 41800.00,
      marketCap: 847200000000,
    },
    {
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2650.80,
      change: -89.20,
      changePercent: -3.25,
      volume: 15240000000,
      high24h: 2780.00,
      low24h: 2620.00,
      marketCap: 318500000000,
    },
    {
      id: 'binancecoin',
      symbol: 'BNB',
      name: 'Binance Coin',
      price: 315.45,
      change: 12.65,
      changePercent: 4.18,
      volume: 1850000000,
      high24h: 320.00,
      low24h: 305.00,
      marketCap: 47200000000,
    },
    {
      id: 'cardano',
      symbol: 'ADA',
      name: 'Cardano',
      price: 0.48,
      change: 0.025,
      changePercent: 5.49,
      volume: 890000000,
      high24h: 0.49,
      low24h: 0.46,
      marketCap: 16800000000,
    },
    {
      id: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      price: 98.75,
      change: -4.32,
      changePercent: -4.19,
      volume: 2140000000,
      high24h: 105.50,
      low24h: 96.20,
      marketCap: 44300000000,
    },
  ]);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prevData => 
        prevData.map(item => ({
          ...item,
          price: item.price + (Math.random() - 0.5) * (item.price * 0.002),
          change: item.change + (Math.random() - 0.5) * 10,
          changePercent: item.changePercent + (Math.random() - 0.5) * 0.5,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

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

  const handleMarketItemPress = (item: MarketData) => {
    router.push({
      pathname: '/product-details',
      params: {
        id: item.id,
        symbol: item.symbol,
        name: item.name,
        price: item.price.toString(),
        changePercent: item.changePercent.toString(),
        volume: item.volume.toString(),
        high24h: item.high24h.toString(),
        low24h: item.low24h.toString(),
        marketCap: item.marketCap.toString(),
      }
    });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'buy':
        router.push('/(tabs)/trading');
        break;
      case 'sell':
        router.push('/(tabs)/trading');
        break;
      case 'transfer':
        router.push('/(tabs)/profile');
        break;
      case 'history':
        router.push('/(tabs)/profile');
        break;
      default:
        break;
    }
  };

  return (
    <LinearGradient
      colors={['#0a0a0a', '#1a1a1a']}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00D4AA" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.username}>John Doe</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Search size={24} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Bell size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Portfolio Card */}
        <View style={styles.portfolioCard}>
          <LinearGradient
            colors={['#00D4AA', '#00B894']}
            style={styles.portfolioGradient}
          >
            <View style={styles.portfolioHeader}>
              <Text style={styles.portfolioTitle}>Portfolio Value</Text>
              <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
                {balanceVisible ? (
                  <Eye size={20} color="#ffffff" />
                ) : (
                  <EyeOff size={20} color="#ffffff" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.portfolioValue}>
              {balanceVisible ? '$124,832.45' : '••••••••'}
            </Text>
            <View style={styles.portfolioChange}>
              <TrendingUp size={16} color="#ffffff" />
              <Text style={styles.portfolioChangeText}>+$3,247.82 (2.68%)</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleQuickAction('buy')}
          >
            <LinearGradient
              colors={['#333', '#444']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionText}>Buy</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleQuickAction('sell')}
          >
            <LinearGradient
              colors={['#333', '#444']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionText}>Sell</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleQuickAction('transfer')}
          >
            <LinearGradient
              colors={['#333', '#444']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionText}>Transfer</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleQuickAction('history')}
          >
            <LinearGradient
              colors={['#333', '#444']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionText}>History</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Market Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Market Overview</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/charts')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {marketData.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.marketItem}
              onPress={() => handleMarketItemPress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.marketItemLeft}>
                <View style={styles.coinInfo}>
                  <View style={styles.coinIcon}>
                    <Text style={styles.coinIconText}>{item.symbol.charAt(0)}</Text>
                  </View>
                  <View style={styles.coinDetails}>
                    <Text style={styles.coinSymbol}>{item.symbol}</Text>
                    <Text style={styles.coinName}>{item.name}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.marketItemRight}>
                <Text style={styles.coinPrice}>{formatPrice(item.price)}</Text>
                <View style={styles.coinChange}>
                  {item.changePercent >= 0 ? (
                    <TrendingUp size={12} color="#00D4AA" />
                  ) : (
                    <TrendingDown size={12} color="#FF4757" />
                  )}
                  <Text style={[
                    styles.coinChangeText,
                    { color: item.changePercent >= 0 ? '#00D4AA' : '#FF4757' }
                  ]}>
                    {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.transactionItem} activeOpacity={0.7}>
            <View style={styles.transactionIcon}>
              <TrendingUp size={16} color="#00D4AA" />
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionType}>Buy BTC</Text>
              <Text style={styles.transactionTime}>2 hours ago</Text>
            </View>
            <View style={styles.transactionAmount}>
              <Text style={styles.transactionValue}>+0.025 BTC</Text>
              <Text style={styles.transactionFiat}>$1,081.25</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.transactionItem} activeOpacity={0.7}>
            <View style={[styles.transactionIcon, { backgroundColor: '#FF475720' }]}>
              <TrendingDown size={16} color="#FF4757" />
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionType}>Sell ETH</Text>
              <Text style={styles.transactionTime}>5 hours ago</Text>
            </View>
            <View style={styles.transactionAmount}>
              <Text style={[styles.transactionValue, { color: '#FF4757' }]}>-1.5 ETH</Text>
              <Text style={styles.transactionFiat}>$3,976.20</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a0a0a0',
  },
  username: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 8,
  },
  portfolioCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  portfolioGradient: {
    padding: 24,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  portfolioTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.8,
  },
  portfolioValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  portfolioChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  portfolioChangeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  seeAll: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#00D4AA',
  },
  marketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  marketItemLeft: {
    flex: 1,
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  coinIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00D4AA20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinIconText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#00D4AA',
  },
  coinDetails: {
    flex: 1,
  },
  coinSymbol: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  coinName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a0a0a0',
    marginTop: 2,
  },
  marketItemRight: {
    alignItems: 'flex-end',
  },
  coinPrice: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  coinChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinChangeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00D4AA20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a0a0a0',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#00D4AA',
    marginBottom: 4,
  },
  transactionFiat: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a0a0a0',
  },
});