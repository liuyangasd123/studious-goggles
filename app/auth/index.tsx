import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Shield, Globe } from 'lucide-react-native';

export default function AuthIndex() {
  const router = useRouter();

  return (
    <ImageBackground
      source={{ uri: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg' }}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TrendingUp size={48} color="#00D4AA" />
            <Text style={styles.title}>CryptoTrade Pro</Text>
            <Text style={styles.subtitle}>Professional Trading Platform</Text>
          </View>

          <View style={styles.features}>
            <View style={styles.feature}>
              <TrendingUp size={32} color="#00D4AA" />
              <Text style={styles.featureTitle}>Real-time Trading</Text>
              <Text style={styles.featureText}>Live market data and instant execution</Text>
            </View>
            <View style={styles.feature}>
              <Shield size={32} color="#00D4AA" />
              <Text style={styles.featureTitle}>Secure & Safe</Text>
              <Text style={styles.featureText}>Bank-level security for your assets</Text>
            </View>
            <View style={styles.feature}>
              <Globe size={32} color="#00D4AA" />
              <Text style={styles.featureTitle}>Global Markets</Text>
              <Text style={styles.featureText}>Access worldwide cryptocurrency markets</Text>
            </View>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => router.push('/auth/register')}
            >
              <LinearGradient
                colors={['#00D4AA', '#00B894']}
                style={styles.buttonGradient}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.secondaryButtonText}>I already have an account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.3,
  },
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#a0a0a0',
    marginTop: 8,
    textAlign: 'center',
  },
  features: {
    marginBottom: 48,
  },
  feature: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  featureTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a0a0a0',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttons: {
    gap: 16,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
  },
});