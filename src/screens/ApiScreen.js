import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';

// Free Public API Endpoint (No authentication required, 100% Free JSON REST API)
const PUBLIC_API_URL = 'https://jsonplaceholder.typicode.com/users';

export default function ApiScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch data using Axios GET request on mount
  useEffect(() => {
    fetchApiData();
  }, []);

  const fetchApiData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Task 2 Requirement: Use axios.get() to send a GET request to the selected API endpoint
      const response = await axios.get(PUBLIC_API_URL, {
        timeout: 10000,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setData(response.data);
      } else {
        throw new Error('Unexpected API response structure');
      }
    } catch (err) {
      console.error('Axios GET Error:', err);
      setError(
        err.response?.status
          ? `Server Error (${err.response.status}): ${err.message}`
          : err.message || 'Failed to connect to Public API. Please check internet connection.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchApiData();
  };

  // Filter API data by name, username, email, company
  const filteredUsers = data.filter((user) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.username.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      (user.company?.name && user.company.name.toLowerCase().includes(q))
    );
  });

  const openUserDetails = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <View style={styles.badgeRow}>
            <View style={styles.apiBadge}>
              <Text style={styles.apiBadgeText}>AXIOS GET</Text>
            </View>
            <View style={styles.onlineBadge}>
              <View style={styles.dot} />
              <Text style={styles.onlineText}>PUBLIC JSON API</Text>
            </View>
          </View>
          <Text style={styles.headerTitle}>Global Faculty / User Directory</Text>
          <Text style={styles.headerSubtitle}>
            Endpoint: {PUBLIC_API_URL}
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.refreshIconBtn, pressed && styles.btnPressed]}
          onPress={fetchApiData}
          disabled={loading}
        >
          <Feather name="refresh-cw" size={16} color={COLORS.primaryLight} />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Feather name="search" size={16} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search API users by name, email, company..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </Pressable>
        )}
      </View>

      {/* API REQUEST STATES */}

      {/* 1. Loading State */}
      {loading && !refreshing && (
        <View style={styles.centerContainer}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={COLORS.primaryLight} />
            <Text style={styles.loadingTitle}>Connecting to Public API...</Text>
            <Text style={styles.loadingSub}>Executing axios.get('{PUBLIC_API_URL}')</Text>
          </View>
        </View>
      )}

      {/* 2. Error State */}
      {!loading && error && (
        <View style={styles.centerContainer}>
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={44} color={COLORS.absent} />
            <Text style={styles.errorTitle}>API Request Failed</Text>
            <Text style={styles.errorMsg}>{error}</Text>

            <Pressable
              style={({ pressed }) => [styles.retryBtn, pressed && styles.btnPressed]}
              onPress={fetchApiData}
            >
              <Feather name="rotate-ccw" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.retryBtnText}>Retry Request</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* 3. Success State: Display retrieved information using Card / List */}
      {!loading && !error && (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primaryLight}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="search" size={42} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No matching users found</Text>
              <Text style={styles.emptySub}>Try searching with a different keyword.</Text>
            </View>
          }
          renderItem={({ item }) => {
            return (
              <Pressable
                style={({ pressed }) => [
                  styles.card,
                  SHADOWS.card,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => openUserDetails(item)}
              >
                {/* Card Top Row */}
                <View style={styles.cardHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {item.name.slice(0, 2).toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.headerInfo}>
                    <Text style={styles.userName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.userUsername}>@{item.username}</Text>
                  </View>

                  <View style={styles.idBadge}>
                    <Text style={styles.idText}>ID #{item.id}</Text>
                  </View>
                </View>

                {/* Info Grid */}
                <View style={styles.infoGrid}>
                  <View style={styles.infoRow}>
                    <Feather name="mail" size={12} color={COLORS.primaryLight} />
                    <Text style={styles.infoText} numberOfLines={1}>
                      {item.email}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Feather name="phone" size={12} color={COLORS.presentText} />
                    <Text style={styles.infoText} numberOfLines={1}>
                      {item.phone}
                    </Text>
                  </View>

                  {item.company?.name && (
                    <View style={styles.infoRow}>
                      <Feather name="briefcase" size={12} color={COLORS.warning} />
                      <Text style={styles.infoText} numberOfLines={1}>
                        {item.company.name}
                      </Text>
                    </View>
                  )}

                  {item.website && (
                    <View style={styles.infoRow}>
                      <Feather name="globe" size={12} color={COLORS.cyan} />
                      <Text style={styles.infoText} numberOfLines={1}>
                        {item.website}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Bottom Card Footer */}
                <View style={styles.cardFooter}>
                  <Text style={styles.cityText}>
                    📍 {item.address?.city || 'Unknown City'}
                  </Text>
                  <View style={styles.viewDetailBadge}>
                    <Text style={styles.viewDetailText}>View Details</Text>
                    <Feather name="chevron-right" size={12} color={COLORS.primaryLight} />
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      )}

      {/* USER DETAILS MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedUser && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>API User Details</Text>
                  <Pressable onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                  </Pressable>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.modalAvatarContainer}>
                    <View style={styles.modalAvatar}>
                      <Text style={styles.modalAvatarText}>
                        {selectedUser.name.slice(0, 2).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.modalName}>{selectedUser.name}</Text>
                    <Text style={styles.modalHandle}>@{selectedUser.username}</Text>
                  </View>

                  <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>CONTACT INFORMATION</Text>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Email:</Text>
                      <Text style={styles.detailVal}>{selectedUser.email}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Phone:</Text>
                      <Text style={styles.detailVal}>{selectedUser.phone}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Website:</Text>
                      <Text style={styles.detailVal}>{selectedUser.website}</Text>
                    </View>
                  </View>

                  <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>COMPANY DETAILS</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Company Name:</Text>
                      <Text style={styles.detailVal}>{selectedUser.company?.name}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Catchphrase:</Text>
                      <Text style={styles.detailVal}>"{selectedUser.company?.catchPhrase}"</Text>
                    </View>
                  </View>

                  <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>ADDRESS</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Street:</Text>
                      <Text style={styles.detailVal}>{selectedUser.address?.street}, {selectedUser.address?.suite}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>City & Zip:</Text>
                      <Text style={styles.detailVal}>{selectedUser.address?.city} ({selectedUser.address?.zipcode})</Text>
                    </View>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  apiBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  apiBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '800',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.presentGlow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.present,
  },
  onlineText: {
    color: COLORS.present,
    fontSize: 10,
    fontWeight: '800',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  refreshIconBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#172235',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnPressed: {
    opacity: 0.7,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    marginHorizontal: 18,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingBox: {
    alignItems: 'center',
    padding: 24,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 14,
  },
  loadingSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#172235',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.absentGlow,
    width: '100%',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 10,
  },
  errorMsg: {
    fontSize: 12,
    color: COLORS.absentText,
    textAlign: 'center',
    marginVertical: 10,
    lineHeight: 18,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 6,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: '#172235',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    padding: 14,
  },
  cardPressed: {
    opacity: 0.9,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryGlow,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userUsername: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  idBadge: {
    backgroundColor: '#0F1726',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  idText: {
    fontSize: 11,
    color: COLORS.primaryLight,
    fontWeight: '800',
  },
  infoGrid: {
    backgroundColor: '#0F1726',
    borderRadius: 12,
    padding: 10,
    gap: 6,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  viewDetailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewDetailText: {
    fontSize: 11,
    color: COLORS.primaryLight,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#172235',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    maxHeight: '88%',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  modalAvatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryGlow,
    borderWidth: 2.5,
    borderColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  modalAvatarText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  modalName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  modalHandle: {
    fontSize: 13,
    color: COLORS.primaryLight,
    fontWeight: '700',
    marginTop: 2,
  },
  detailsSection: {
    backgroundColor: '#0F1726',
    borderRadius: 14,
    padding: 12,
    gap: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  detailVal: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
});
