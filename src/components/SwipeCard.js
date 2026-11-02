import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;

export default function SwipeCard({
  student,
  nextStudent,
  onSwipe,
  activeCardRef,
}) {
  const pan = useRef(new Animated.ValueXY()).current;

  // Programmatic swipe trigger (via buttons)
  useEffect(() => {
    if (activeCardRef) {
      activeCardRef.current = {
        forceSwipe: (direction) => {
          const x = direction === 'PRESENT' ? SCREEN_WIDTH * 1.35 : -SCREEN_WIDTH * 1.35;
          Animated.timing(pan, {
            toValue: { x, y: 0 },
            duration: 220,
            useNativeDriver: false,
          }).start(() => {
            onSwipe(direction, student);
            pan.setValue({ x: 0, y: 0 });
          });
        },
      };
    }
  }, [student, onSwipe]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD || gestureState.vx > 0.6) {
          // Swipe Right -> PRESENT
          Animated.timing(pan, {
            toValue: { x: SCREEN_WIDTH * 1.35, y: gestureState.dy },
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            onSwipe('PRESENT', student);
            pan.setValue({ x: 0, y: 0 });
          });
        } else if (gestureState.dx < -SWIPE_THRESHOLD || gestureState.vx < -0.6) {
          // Swipe Left -> ABSENT
          Animated.timing(pan, {
            toValue: { x: -SCREEN_WIDTH * 1.35, y: gestureState.dy },
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            onSwipe('ABSENT', student);
            pan.setValue({ x: 0, y: 0 });
          });
        } else {
          // Spring back to center
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            tension: 40,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Card rotation interpolation based on drag
  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.2, 0, SCREEN_WIDTH * 1.2],
    outputRange: ['-14deg', '0deg', '14deg'],
  });

  // Stamp opacities
  const presentOpacity = pan.x.interpolate({
    inputRange: [20, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const absentOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -20],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Next card depth animation
  const nextCardScale = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [1, 0.93, 1],
    extrapolate: 'clamp',
  });

  const nextCardOpacity = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [1, 0.6, 1],
    extrapolate: 'clamp',
  });

  const getInitials = (name) => {
    if (!name) return 'ST';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <View style={styles.container}>
      {/* Background Next Card Preview */}
      {nextStudent && (
        <Animated.View
          style={[
            styles.card,
            styles.nextCard,
            {
              transform: [{ scale: nextCardScale }],
              opacity: nextCardOpacity,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={styles.rollBadgeNext}>
              <Text style={styles.rollBadgeNextText}>#{nextStudent.rollNo}</Text>
            </View>
            <View style={styles.upNextBadge}>
              <Text style={styles.upNextText}>NEXT IN QUEUE</Text>
            </View>
          </View>

          <View style={styles.avatarContainer}>
            <View style={styles.nextAvatar}>
              <Text style={styles.nextAvatarText}>{getInitials(nextStudent.name)}</Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.nextStudentName} numberOfLines={1}>
              {nextStudent.name}
            </Text>
            <Text style={styles.studentSub}>Ready to evaluate</Text>
          </View>

          <View style={styles.cardBottomPlaceholder} />
        </Animated.View>
      )}

      {/* Active Foreground Tinder Card */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.card,
          styles.activeCard,
          SHADOWS.card,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
          },
        ]}
      >
        {/* PRESENT STAMP */}
        <Animated.View
          style={[
            styles.stampBadge,
            styles.presentStamp,
            { opacity: presentOpacity },
          ]}
        >
          <Ionicons name="checkmark-circle" size={26} color={COLORS.present} />
          <Text style={styles.presentStampText}>PRESENT</Text>
        </Animated.View>

        {/* ABSENT STAMP */}
        <Animated.View
          style={[
            styles.stampBadge,
            styles.absentStamp,
            { opacity: absentOpacity },
          ]}
        >
          <Ionicons name="close-circle" size={26} color={COLORS.absent} />
          <Text style={styles.absentStampText}>ABSENT</Text>
        </Animated.View>

        {/* Card Header: Roll No & Instructions */}
        <View style={styles.cardHeader}>
          <View style={styles.rollBadge}>
            <Feather name="hash" size={14} color={COLORS.primaryLight} style={{ marginRight: 2 }} />
            <Text style={styles.rollBadgeText}>ROLL {student.rollNo}</Text>
          </View>
          <View style={styles.statusChip}>
            <Ionicons name="finger-print" size={13} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
            <Text style={styles.statusChipText}>SWIPE DECK</Text>
          </View>
        </View>

        {/* Student Avatar with Glowing Ring */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarOuterGlow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(student.name)}</Text>
            </View>
          </View>
        </View>

        {/* Student Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.studentName} numberOfLines={2}>
            {student.name}
          </Text>
          <View style={styles.emailChip}>
            <Ionicons name="school-outline" size={12} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
            <Text style={styles.studentSub}>
              {student.email || 'Enrolled Student'}
            </Text>
          </View>
        </View>

        {/* Bottom Swipe Directions Guideline */}
        <View style={styles.swipeGuideContainer}>
          <View style={styles.guideItem}>
            <View style={[styles.guideIcon, { backgroundColor: COLORS.absentGlow }]}>
              <Ionicons name="arrow-back" size={14} color={COLORS.absent} />
            </View>
            <Text style={[styles.guideText, { color: COLORS.absentText }]}>
              Swipe Left: Absent
            </Text>
          </View>

          <View style={styles.guideDivider} />

          <View style={styles.guideItem}>
            <Text style={[styles.guideText, { color: COLORS.presentText }]}>
              Swipe Right: Present
            </Text>
            <View style={[styles.guideIcon, { backgroundColor: COLORS.presentGlow }]}>
              <Ionicons name="arrow-forward" size={14} color={COLORS.present} />
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - 32,
    height: Math.min(SCREEN_HEIGHT * 0.54, 460),
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 26,
    backgroundColor: COLORS.bgCardElevated,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    padding: 22,
    justifyContent: 'space-between',
  },
  activeCard: {
    zIndex: 10,
    backgroundColor: '#172235',
  },
  nextCard: {
    zIndex: 5,
    top: 14,
    backgroundColor: '#0F1726',
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rollBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  rollBadgeText: {
    color: COLORS.primaryLight,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.8,
  },
  rollBadgeNext: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  rollBadgeNextText: {
    color: COLORS.textMuted,
    fontWeight: '700',
    fontSize: 12,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statusChipText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  upNextBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  upNextText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  avatarOuterGlow: {
    padding: 6,
    borderRadius: 65,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#1E293B',
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  nextAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#151D2A',
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextAvatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  infoContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  studentName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  nextStudentName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  emailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  studentSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  stampBadge: {
    position: 'absolute',
    top: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 2.5,
    zIndex: 25,
  },
  presentStamp: {
    right: 18,
    borderColor: COLORS.present,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    transform: [{ rotate: '12deg' }],
  },
  presentStampText: {
    color: COLORS.present,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1.5,
    marginLeft: 6,
  },
  absentStamp: {
    left: 18,
    borderColor: COLORS.absent,
    backgroundColor: 'rgba(244, 63, 94, 0.25)',
    transform: [{ rotate: '-12deg' }],
  },
  absentStampText: {
    color: COLORS.absent,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1.5,
    marginLeft: 6,
  },
  swipeGuideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(11, 15, 23, 0.75)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guideIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideText: {
    fontSize: 11,
    fontWeight: '700',
  },
  guideDivider: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.borderLight,
  },
  cardBottomPlaceholder: {
    height: 38,
  },
});
