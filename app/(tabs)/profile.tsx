import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Shield, Bell, CreditCard, History, CircleHelp as HelpCircle, LogOut, ChevronRight, TrendingUp, Wallet, Copy, Eye, EyeOff } from 'lucide-react-native';

export default function Profile() {
  const router = useRouter();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const portfolioData = {
    totalBalance: 124832.45,
    todayChange: 3247.82,
    todayChangePercent: 2.68,
    holdings: [
      { symbol: 'BTC', amount: 2.5, value: 108126.25, change: 2.4 },
      { symbol: 'ETH', amount: 15.2, value: 40292.16, change: -1.8 },
      { symbol: 'BNB', amount: 45.8, value: 14447.41, change: 4.2 },
      { symbol: 'ADA', amount: 12500, value: 6000.00, change: 5.1 },
    ]
  };

  const menuItems = [
    { icon: Settings, title: 'Account Settings', subtitle: 'Personal information & preferences', action: () => {} },
    { icon: Shield, title: 'Security', subtitle: '2FA, biometrics & login activity', action: () => {} },
    { icon: Bell, title: 'Notifications', subtitle: 'Price alerts & news updates', action: () => {} },
    { icon: CreditCard, title: 'Payment Methods', subtitle: 'Bank accounts & cards', action: () => {} },
    { icon: History, title: 'Transaction History', subtitle: 'All trading & transfer records', action: () => {} },
    { icon: HelpCircle, title: 'Help & Support', subtitle: 'FAQs, contact support', action: () => {} },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => router.replace('/auth')
        }
      ]
    );
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000) {
      return amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }
    return amount.toFixed(6);
  };

  const copyToClipboard = (text: string) => {
    // Web implementation would use navigator.clipboard
    Alert.alert('Copied', 'Address copied to clipboard');
  };

  return (
    <LinearGradient
      colors={['#0a0a0a', '#1a1a1a']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <User size={32} color="#ffffff" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>John Doe</Text>
              <Text style={styles.userEmail}>john.doe@example.com</Text>
              <Text style={styles.userLevel}>VIP Level 2</Text>
            </View>
          </View>
        </View>

        {/* Portfolio Overview */}
        <View style={styles.portfolioCard}>
          <LinearGradient
            colors={['#00D4AA', '#00B894']}
            style={styles.portfolioGradient}
          >
            <View style={styles.portfolioHeader}>
              <Text style={styles.portfolioTitle}>Total Portfolio Value</Text>
              <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
                {balanceVisible ? (
                  <Eye size={20} color="#ffffff" />
                ) : (
                  <EyeOff size={20} color="#ffffff" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.portfolioValue}>
              {balanceVisible ? formatPrice(portfolioData.totalBalance) : '••••••••'}
            </Text>
            <View style={styles.portfolioChange}>
              <TrendingUp size={16} color="#ffffff" />
              <Text style={styles.portfolioChangeText}>
                +{formatPrice(portfolioData.todayChange)} ({portfolioData.todayChangePercent.toFixed(2)}%)
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Holdings */}
        <View style={styles.holdingsContainer}>
          <Text style={styles.sectionTitle}>My Holdings</Text>
          {portfolioData.holdings.map((holding, index) => (
            <View key={index} style={styles.holdingItem}>
              <View style={styles.holdingLeft}>
                <View style={styles.holdingIcon}>
                  <Text style={styles.holdingSymbol}>{holding.symbol}</Text>
                </View>
                <View style={styles.holdingInfo}>
                  <Text style={styles.holdingName}>{holding.symbol}</Text>
                  <Text style={styles.holdingAmount}>
                    {formatAmount(holding.amount)} {holding.symbol}
                  </Text>
                </View>
              </View>
              <View style={styles.holdingRight}>
                <Text style={styles.holdingValue}>{formatPrice(holding.value)}</Text>
                <Text style={[
                  styles.holdingChange,
                  { color: holding.change >= 0 ? '#00D4AA' : '#FF4757' }
                ]}>
                  {holding.change >= 0 ? '+' : ''}{holding.change.toFixed(2)}%
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Wallet Address */}
        <View style={styles.walletContainer}>
          <Text style={styles.sectionTitle}>Wallet Address</Text>
          <View style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <Wallet size={20} color="#00D4AA" />
              <Text style={styles.addressLabel}>BTC Address</Text>
            </View>
            <View style={styles.addressRow}>
              <Text style={styles.addressText}>bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => copyToClipboard('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')}
              >
                <Copy size={16} color="#00D4AA" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
              <View style={styles.menuLeft}>
                <View style={styles.menuIcon}>
                  <item.icon size={20} color="#00D4AA" />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#FF4757" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>CryptoTrade Pro v1.0.0</Text>
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
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a0a0a0',
    marginBottom: 4,
  },
  userLevel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#00D4AA',
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
  holdingsContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  holdingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  holdingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  holdingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00D4AA20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  holdingSymbol: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#00D4AA',
  },
  holdingInfo: {
    flex: 1,
  },
  holdingName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  holdingAmount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a0a0a0',
  },
  holdingRight: {
    alignItems: 'flex-end',
  },
  holdingValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  holdingChange: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  walletContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  addressCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginLeft: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a0a0a0',
    flex: 1,
    marginRight: 8,
  },
  copyButton: {
    padding: 4,
  },
  menuContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00D4AA20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a0a0a0',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF475720',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF4757',
  },
  versionContainer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
});