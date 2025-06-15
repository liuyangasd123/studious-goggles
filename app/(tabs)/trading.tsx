import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, Search, Filter } from 'lucide-react-native';

interface OrderBookItem {
  price: number;
  amount: number;
  total: number;
}

interface TradeData {
  price: number;
  amount: number;
  time: string;
  type: 'buy' | 'sell';
}

export default function Trading() {
  const params = useLocalSearchParams();
  const [selectedPair, setSelectedPair] = useState((params.symbol as string) || 'BTC/USDT');
  const [orderType, setOrderType] = useState<'buy' | 'sell'>((params.action as 'buy' | 'sell') || 'buy');
  const [tradeType, setTradeType] = useState<'market' | 'limit'>('limit');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState((params.price as string) || '');
  const [currentPrice, setCurrentPrice] = useState(parseFloat(params.price as string) || 43250.50);

  const [orderBook, setOrderBook] = useState({
    asks: [
      { price: 43280.50, amount: 0.125, total: 5410.06 },
      { price: 43275.25, amount: 0.345, total: 14924.84 },
      { price: 43270.00, amount: 0.200, total: 8654.00 },
      { price: 43265.75, amount: 0.150, total: 6489.86 },
      { price: 43260.50, amount: 0.275, total: 11896.64 },
    ] as OrderBookItem[],
    bids: [
      { price: 43245.25, amount: 0.180, total: 7784.15 },
      { price: 43240.00, amount: 0.220, total: 9512.80 },
      { price: 43235.75, amount: 0.165, total: 7133.90 },
      { price: 43230.50, amount: 0.300, total: 12969.15 },
      { price: 43225.25, amount: 0.145, total: 6267.66 },
    ] as OrderBookItem[],
  });

  const [recentTrades, setRecentTrades] = useState<TradeData[]>([
    { price: 43250.50, amount: 0.125, time: '14:32:15', type: 'buy' },
    { price: 43248.25, amount: 0.200, time: '14:32:10', type: 'sell' },
    { price: 43252.75, amount: 0.180, time: '14:32:05', type: 'buy' },
    { price: 43245.00, amount: 0.150, time: '14:32:00', type: 'sell' },
    { price: 43255.25, amount: 0.300, time: '14:31:55', type: 'buy' },
  ]);

  // Update price when params change
  useEffect(() => {
    if (params.price) {
      setCurrentPrice(parseFloat(params.price as string));
      setPrice(params.price as string);
    }
    if (params.symbol) {
      setSelectedPair(params.symbol as string);
    }
    if (params.action) {
      setOrderType(params.action as 'buy' | 'sell');
    }
  }, [params]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update current price
      setCurrentPrice(prev => prev + (Math.random() - 0.5) * 20);
      
      // Update order book
      setOrderBook(prev => ({
        asks: prev.asks.map(item => ({
          ...item,
          amount: Math.max(0.001, item.amount + (Math.random() - 0.5) * 0.1),
        })),
        bids: prev.bids.map(item => ({
          ...item,
          amount: Math.max(0.001, item.amount + (Math.random() - 0.5) * 0.1),
        })),
      }));

      // Add new trade
      setRecentTrades(prev => {
        const newTrade: TradeData = {
          price: currentPrice + (Math.random() - 0.5) * 10,
          amount: Math.random() * 0.5,
          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          type: Math.random() > 0.5 ? 'buy' : 'sell',
        };
        return [newTrade, ...prev.slice(0, 19)];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentPrice]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatAmount = (amount: number) => {
    return amount.toFixed(6);
  };

  const handleTrade = () => {
    // Simulate trade execution
    console.log(`${orderType.toUpperCase()} ${tradeType.toUpperCase()} order: ${amount} ${selectedPair.split('/')[0]} at ${price || 'market price'}`);
    
    // Reset form
    setAmount('');
    if (tradeType === 'limit') {
      setPrice('');
    }
    
    // Show success feedback (in a real app, this would be a toast or modal)
    alert(`${orderType.toUpperCase()} order placed successfully!`);
  };

  const handlePercentageSelect = (percentage: number) => {
    // Calculate amount based on percentage of available balance
    // This is a simplified calculation - in a real app, you'd use actual balance
    const mockBalance = 1.5; // Mock balance
    const calculatedAmount = (mockBalance * percentage / 100).toFixed(6);
    setAmount(calculatedAmount);
  };

  return (
    <LinearGradient
      colors={['#0a0a0a', '#1a1a1a']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.pairSelector}>
            <Text style={styles.selectedPair}>{selectedPair}</Text>
            <Text style={styles.currentPrice}>${formatPrice(currentPrice)}</Text>
            <View style={styles.priceChange}>
              <TrendingUp size={12} color="#00D4AA" />
              <Text style={styles.priceChangeText}>+2.98%</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Search size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Filter size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Trading Interface */}
        <View style={styles.tradingInterface}>
          {/* Order Type Selector */}
          <View style={styles.orderTypeSelector}>
            <TouchableOpacity
              style={[styles.orderTypeButton, orderType === 'buy' && styles.buyButton]}
              onPress={() => setOrderType('buy')}
            >
              <Text style={[styles.orderTypeText, orderType === 'buy' && styles.buyText]}>
                Buy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.orderTypeButton, orderType === 'sell' && styles.sellButton]}
              onPress={() => setOrderType('sell')}
            >
              <Text style={[styles.orderTypeText, orderType === 'sell' && styles.sellText]}>
                Sell
              </Text>
            </TouchableOpacity>
          </View>

          {/* Trade Type Selector */}
          <View style={styles.tradeTypeSelector}>
            <TouchableOpacity
              style={[styles.tradeTypeButton, tradeType === 'limit' && styles.activeTradeType]}
              onPress={() => setTradeType('limit')}
            >
              <Text style={[styles.tradeTypeText, tradeType === 'limit' && styles.activeTradeTypeText]}>
                Limit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tradeTypeButton, tradeType === 'market' && styles.activeTradeType]}
              onPress={() => setTradeType('market')}
            >
              <Text style={[styles.tradeTypeText, tradeType === 'market' && styles.activeTradeTypeText]}>
                Market
              </Text>
            </TouchableOpacity>
          </View>

          {/* Order Form */}
          <View style={styles.orderForm}>
            {tradeType === 'limit' && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Price (USDT)</Text>
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>
            )}
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Amount ({selectedPair.split('/')[0]})</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00000000"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.percentageButtons}>
              {[25, 50, 75, 100].map(percent => (
                <TouchableOpacity 
                  key={percent} 
                  style={styles.percentageButton}
                  onPress={() => handlePercentageSelect(percent)}
                >
                  <Text style={styles.percentageButtonText}>{percent}%</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.tradeButton, orderType === 'buy' ? styles.buyTradeButton : styles.sellTradeButton]}
              onPress={handleTrade}
              disabled={!amount || (tradeType === 'limit' && !price)}
            >
              <Text style={styles.tradeButtonText}>
                {orderType === 'buy' ? 'Buy' : 'Sell'} {selectedPair.split('/')[0]}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Market Data */}
        <View style={styles.marketData}>
          {/* Order Book */}
          <View style={styles.orderBookContainer}>
            <Text style={styles.sectionTitle}>Order Book</Text>
            <View style={styles.orderBookHeader}>
              <Text style={styles.orderBookHeaderText}>Price (USDT)</Text>
              <Text style={styles.orderBookHeaderText}>Amount ({selectedPair.split('/')[0]})</Text>
              <Text style={styles.orderBookHeaderText}>Total</Text>
            </View>
            
            {/* Asks */}
            {orderBook.asks.reverse().map((ask, index) => (
              <TouchableOpacity
                key={`ask-${index}`}
                style={styles.orderBookRow}
                onPress={() => tradeType === 'limit' && setPrice(ask.price.toString())}
              >
                <Text style={[styles.orderBookPrice, styles.askPrice]}>
                  {formatPrice(ask.price)}
                </Text>
                <Text style={styles.orderBookAmount}>{formatAmount(ask.amount)}</Text>
                <Text style={styles.orderBookTotal}>{formatPrice(ask.total)}</Text>
              </TouchableOpacity>
            ))}

            {/* Current Price */}
            <View style={styles.currentPriceRow}>
              <Text style={styles.currentPriceText}>${formatPrice(currentPrice)}</Text>
            </View>

            {/* Bids */}
            {orderBook.bids.map((bid, index) => (
              <TouchableOpacity
                key={`bid-${index}`}
                style={styles.orderBookRow}
                onPress={() => tradeType === 'limit' && setPrice(bid.price.toString())}
              >
                <Text style={[styles.orderBookPrice, styles.bidPrice]}>
                  {formatPrice(bid.price)}
                </Text>
                <Text style={styles.orderBookAmount}>{formatAmount(bid.amount)}</Text>
                <Text style={styles.orderBookTotal}>{formatPrice(bid.total)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Trades */}
          <View style={styles.recentTradesContainer}>
            <Text style={styles.sectionTitle}>Recent Trades</Text>
            <View style={styles.tradesHeader}>
              <Text style={styles.tradesHeaderText}>Price (USDT)</Text>
              <Text style={styles.tradesHeaderText}>Amount ({selectedPair.split('/')[0]})</Text>
              <Text style={styles.tradesHeaderText}>Time</Text>
            </View>
            
            {recentTrades.map((trade, index) => (
              <View key={index} style={styles.tradeRow}>
                <Text style={[
                  styles.tradePrice,
                  trade.type === 'buy' ? styles.buyPrice : styles.sellPrice
                ]}>
                  {formatPrice(trade.price)}
                </Text>
                <Text style={styles.tradeAmount}>{formatAmount(trade.amount)}</Text>
                <Text style={styles.tradeTime}>{trade.time}</Text>
              </View>
            ))}
          </View>
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
  pairSelector: {
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
    color: '#00D4AA',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 8,
  },
  tradingInterface: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  orderTypeSelector: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  orderTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  buyButton: {
    backgroundColor: '#00D4AA',
  },
  sellButton: {
    backgroundColor: '#FF4757',
  },
  orderTypeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  buyText: {
    color: '#ffffff',
  },
  sellText: {
    color: '#ffffff',
  },
  tradeTypeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tradeTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 6,
    backgroundColor: '#1a1a1a',
  },
  activeTradeType: {
    backgroundColor: '#333',
  },
  tradeTypeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#a0a0a0',
  },
  activeTradeTypeText: {
    color: '#ffffff',
  },
  orderForm: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#a0a0a0',
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
  },
  percentageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  percentageButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  percentageButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#a0a0a0',
  },
  tradeButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 8,
  },
  buyTradeButton: {
    backgroundColor: '#00D4AA',
  },
  sellTradeButton: {
    backgroundColor: '#FF4757',
  },
  tradeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  marketData: {
    paddingHorizontal: 24,
    gap: 24,
  },
  orderBookContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  orderBookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 8,
  },
  orderBookHeaderText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#a0a0a0',
    flex: 1,
    textAlign: 'right',
  },
  orderBookRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  orderBookPrice: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    flex: 1,
    textAlign: 'right',
  },
  askPrice: {
    color: '#FF4757',
  },
  bidPrice: {
    color: '#00D4AA',
  },
  orderBookAmount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    flex: 1,
    textAlign: 'right',
  },
  orderBookTotal: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a0a0a0',
    flex: 1,
    textAlign: 'right',
  },
  currentPriceRow: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#333',
    marginVertical: 8,
  },
  currentPriceText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#00D4AA',
  },
  recentTradesContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  tradesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 8,
  },
  tradesHeaderText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#a0a0a0',
    flex: 1,
    textAlign: 'right',
  },
  tradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  tradePrice: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    flex: 1,
    textAlign: 'right',
  },
  buyPrice: {
    color: '#00D4AA',
  },
  sellPrice: {
    color: '#FF4757',
  },
  tradeAmount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    flex: 1,
    textAlign: 'right',
  },
  tradeTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a0a0a0',
    flex: 1,
    textAlign: 'right',
  },
});