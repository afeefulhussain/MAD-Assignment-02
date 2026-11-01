import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';
import { getApiBaseUrl, setApiBaseUrl, checkBackendHealth } from '../api';

export default function SettingsScreen() {
  const [url, setUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [healthResult, setHealthResult] = useState(null);

  useEffect(() => {
    async function load() {
      const saved = await getApiBaseUrl();
      setUrl(saved);
      runHealthCheck(saved);
    }
    load();
  }, []);

  const runHealthCheck = async (targetUrl) => {
    setTesting(true);
    setHealthResult(null);
    const res = await checkBackendHealth();
    setHealthResult(res);
    setTesting(false);
  };

  const handleSaveUrl = async () => {
    if (!url.trim()) return;
    await setApiBaseUrl(url.trim());
    Alert.alert('Saved', 'Backend server URL updated.');
    runHealthCheck(url.trim());
  };

  const applyPreset = async (presetUrl) => {
    setUrl(presetUrl);
    await setApiBaseUrl(presetUrl);
    runHealthCheck(presetUrl);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>Backend & App Config</Text>
        <Text style={styles.subtitle}>Manage connection to Node.js & MongoDB</Text>
      </View>

      {/* Connection Status Card */}
      <View style={[styles.card, SHADOWS.card]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Backend Server Status</Text>
          <TouchableOpacity
            style={styles.refreshIconBtn}
            onPress={() => runHealthCheck(url)}
            disabled={testing}
          >
            {testing ? (
              <ActivityIndicator size="small" color={COLORS.primaryLight} />
            ) : (
              <Ionicons name="reload" size={16} color={COLORS.primaryLight} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.statusIndicatorRow}>
          <View
            style={[
              styles.statusCircle,
              { backgroundColor: healthResult?.online ? COLORS.present : COLORS.absent },
            ]}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.statusMainText}>
              {healthResult?.online ? 'Connected to Backend' : 'Running Offline Mode'}
            </Text>
            <Text style={styles.statusSubText}>
              {healthResult?.online
                ? `DB: ${healthResult.databaseConnected ? 'MongoDB Live' : 'In-Memory Cache (Active)'}`
                : 'Local AsyncStorage cache is active for offline reliability'}
            </Text>
          </View>
        </View>
      </View>

      {/* Server URL Config */}
      <View style={[styles.card, SHADOWS.card]}>
        <Text style={styles.cardTitle}>API Endpoint URL</Text>
        <Text style={styles.inputHelp}>
          Node.js Express backend base URL
        </Text>

        <TextInput
          style={styles.textInput}
          value={url}
          onChangeText={setUrl}
          placeholder="http://10.0.2.2:5000/api"
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.presetsRow}>
          <TouchableOpacity
            style={styles.presetChip}
            onPress={() => applyPreset('http://10.0.2.2:5000/api')}
          >
            <Text style={styles.presetText}>Android (10.0.2.2)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.presetChip}
            onPress={() => applyPreset('http://localhost:5000/api')}
          >
            <Text style={styles.presetText}>Localhost</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveUrl}>
          <Text style={styles.saveBtnText}>Save & Test Connection</Text>
        </TouchableOpacity>
      </View>

      {/* Architecture Info */}
      <View style={[styles.card, SHADOWS.card]}>
        <Text style={styles.cardTitle}>App Architecture</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Frontend:</Text>
          <Text style={styles.infoVal}>React Native / Expo (Slate Minimalist UI)</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Swipe Engine:</Text>
          <Text style={styles.infoVal}>60 FPS Animated + PanResponder</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Backend Server:</Text>
          <Text style={styles.infoVal}>Node.js + Express.js + Mongoose</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>WhatsApp Engine:</Text>
          <Text style={styles.infoVal}>Direct wa.me Deep-linking & Formatting</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  header: {
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.bgCardElevated,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  refreshIconBtn: {
    padding: 6,
    backgroundColor: COLORS.bgDark,
    borderRadius: 8,
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgDark,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  statusCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusMainText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statusSubText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  inputHelp: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: COLORS.bgDark,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    fontSize: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  presetChip: {
    backgroundColor: COLORS.bgCardHover,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  presetText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  infoVal: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
});
