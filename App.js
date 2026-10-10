import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.badge}>Expo Go Ready</Text>
          <Text style={styles.title}>🚀 My Expo App</Text>
          <Text style={styles.subtitle}>
            Aapki React Native & Expo app successfully setup ho chuki hai!
          </Text>
        </View>

        {/* Interactive Counter Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚡ Interactive Test</Text>
          <Text style={styles.countText}>Count: {count}</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.btn, styles.btnPrimary]} 
              onPress={() => setCount(count + 1)}
              activeOpacity={0.8}
            >
              <Text style={styles.btnText}>+ Tap to Increment</Text>
            </TouchableOpacity>

            {count > 0 && (
              <TouchableOpacity 
                style={[styles.btn, styles.btnReset]} 
                onPress={() => setCount(0)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnResetText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Instructions Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📱 Expo Go me kaise chalayein?</Text>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>
              Play Store / App Store se <Text style={styles.bold}>Expo Go</Text> app install karein.
            </Text>
          </View>

          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>
              Terminal me <Text style={styles.codeText}>npx expo start</Text> run karein.
            </Text>
          </View>

          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>
              Expo Go app se terminal ka <Text style={styles.bold}>QR Code</Text> scan karein.
            </Text>
          </View>

          <View style={styles.step}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepText}>
              App mobile par load ho jayegi! Code edit karte hi live refresh hoga.
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    padding: 24,
    paddingTop: 40,
    alignItems: 'stretch',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  badge: {
    backgroundColor: '#E0E7FF',
    color: '#4338CA',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  countText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4F46E5',
    textAlign: 'center',
    marginVertical: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: '#4F46E5',
    flex: 1,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  btnReset: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 16,
  },
  btnResetText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 15,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 26,
    marginRight: 12,
    fontSize: 13,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  bold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  codeText: {
    fontFamily: 'monospace',
    backgroundColor: '#F1F5F9',
    color: '#0F172A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 13,
    fontWeight: '600',
  },
});

