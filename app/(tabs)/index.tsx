import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { currentUser, freelancers, events, communities } from '@/data/mockData';
import { Colors, Spacing, BorderRadius, Shadows, Typography } from '@/constants/theme';
import Avatar from '@/components/ui/Avatar';
import StarRating from '@/components/ui/StarRating';
import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';
import ModernCard from '@/components/ui/ModernCard';

const { width: W } = Dimensions.get('window');

function AnimatedCard({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: object }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}

export default function HomeScreen() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Hello' : 'Good evening';
  const greetingIcon =
    hour < 12 ? 'white-balance-sunny' : hour < 17 ? 'hand-wave' : 'moon-waning-crescent';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.greetingSection}>
            <View style={styles.greetingRow}>
              <MaterialCommunityIcons
                name={greetingIcon}
                size={24}
                color={Colors.primary}
              />
              <Text style={styles.greeting}>{greeting},</Text>
            </View>
            <Text style={styles.userName}>{currentUser.name.split(' ')[0]}</Text>
            <Text style={styles.university}>
              {currentUser.university} · {currentUser.year}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => router.push('/notifications')}
              style={styles.notifBtn}
            >
              <MaterialCommunityIcons
                name="bell-outline"
                size={24}
                color={Colors.text}
              />
              <View style={styles.notifDot} />
            </TouchableOpacity>
            <Avatar uri={currentUser.avatar} size={44} />
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Orders', value: currentUser.completedOrders, icon: 'check-circle' },
            { label: 'Earnings', value: `₹${(currentUser.earnings / 1000).toFixed(1)}k`, icon: 'wallet' },
            { label: 'Rating', value: currentUser.rating.toFixed(1), icon: 'star' },
          ].map((stat) => (
            <ModernCard key={stat.label} shadow="sm" padding="md" style={styles.statCard}>
              <MaterialCommunityIcons
                name={stat.icon as any}
                size={20}
                color={Colors.primary}
                style={{ marginBottom: Spacing.sm }}
              />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </ModernCard>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <AnimatedCard delay={100} style={styles.section}>
        <View style={styles.quickActions}>
          {[
            {
              icon: 'plus-circle-outline',
              label: 'Post Service',
              color: Colors.primary,
              route: '/post-service',
            },
            {
              icon: 'calendar-plus',
              label: 'Create Event',
              color: '#DC2626',
              route: '/create-event',
            },
            {
              icon: 'magnify',
              label: 'Find Services',
              color: '#16A34A',
              route: '/(tabs)/marketplace',
            },
            { icon: 'shield-check', label: 'Admin', color: '#EA580C', route: '/admin' },
          ].map((action) => (
            <TouchableOpacity
              key={action.label}
              onPress={() => router.push(action.route as any)}
              style={styles.quickAction}
              activeOpacity={0.8}
            >
              <View style={[styles.quickIcon, { backgroundColor: action.color + '15' }]}>
                <MaterialCommunityIcons
                  name={action.icon as any}
                  size={24}
                  color={action.color}
                />
              </View>
              <Text style={styles.quickLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </AnimatedCard>

      {/* Featured Freelancers */}
      <AnimatedCard delay={200} style={styles.section}>
        <SectionHeader
          title="Featured Freelancers"
          actionLabel="See all"
          onAction={() => router.push('/(tabs)/marketplace')}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {freelancers.map((freelancer) => (
            <TouchableOpacity
              key={freelancer.id}
              onPress={() => router.push(`/marketplace/${freelancer.id}`)}
              activeOpacity={0.9}
              style={styles.freelancerCard}
            >
              <View style={styles.freelancerHeader}>
                <Avatar uri={freelancer.avatar} size={56} />
                {freelancer.isVerified && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={16}
                    color={Colors.primary}
                    style={styles.verifiedBadge}
                  />
                )}
              </View>
              <Text style={styles.freelancerName} numberOfLines={1}>
                {freelancer.name}
              </Text>
              <Text style={styles.freelancerRole} numberOfLines={2}>
                {freelancer.role}
              </Text>
              <View style={styles.ratingContainer}>
                <StarRating rating={freelancer.rating} reviews={freelancer.reviews} size="sm" />
              </View>
              <Text style={styles.freelancerPrice}>
                From ₹{Math.min(...freelancer.services.map((s) => s.price))}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </AnimatedCard>

      {/* Upcoming Events */}
      <AnimatedCard delay={300} style={styles.section}>
        <SectionHeader
          title="Upcoming Events"
          actionLabel="See all"
          onAction={() => router.push('/(tabs)/events')}
        />
        {events.slice(0, 3).map((event) => (
          <TouchableOpacity
            key={event.id}
            onPress={() => router.push(`/events/${event.id}`)}
            activeOpacity={0.9}
            style={styles.eventRow}
          >
            <View
              style={[
                styles.eventIcon,
                { backgroundColor: event.communityColor + '15' },
              ]}
            >
              <MaterialCommunityIcons
                name={event.emoji as any}
                size={24}
                color={event.communityColor}
              />
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle} numberOfLines={1}>
                {event.title}
              </Text>
              <Text style={styles.eventMeta}>
                {event.date} · {event.location.split(',')[0]}
              </Text>
              <Text style={styles.eventCommunity}>{event.community}</Text>
            </View>
            <View style={styles.eventRight}>
              <Badge
                label={event.isFree ? 'Free' : event.registrationFee || 'Paid'}
                variant={event.isFree ? 'free' : 'paid'}
                size="sm"
              />
              {event.isRegistered && (
                <View style={styles.registeredTag}>
                  <MaterialCommunityIcons
                    name="check"
                    size={12}
                    color={Colors.success}
                  />
                  <Text style={styles.registeredText}>Registered</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </AnimatedCard>

      {/* Community Highlights */}
      <AnimatedCard delay={400} style={[styles.section, { marginBottom: 100 }]}>
        <SectionHeader
          title="Community Highlights"
          actionLabel="See all"
          onAction={() => router.push('/(tabs)/communities')}
        />
        {communities
          .filter((c) => c.isFollowing)
          .flatMap((c) => c.posts.slice(0, 1).map((p) => ({ ...p, community: c })))
          .slice(0, 3)
          .map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(`/communities/${item.community.id}`)}
              activeOpacity={0.9}
              style={styles.communityPost}
            >
              <View
                style={[
                  styles.communityIcon,
                  { backgroundColor: item.community.color + '15' },
                ]}
              >
                <MaterialCommunityIcons
                  name={item.community.emoji as any}
                  size={22}
                  color={item.community.color}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.communityName}>{item.community.name}</Text>
                <Text style={styles.postTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <View style={styles.postMeta}>
                  <Text style={styles.postTime}>{item.time}</Text>
                  <View style={styles.postLikes}>
                    <MaterialCommunityIcons
                      name="heart"
                      size={12}
                      color={Colors.error}
                    />
                    <Text style={styles.postLikesText}>{item.likes}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </AnimatedCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    backgroundColor: Colors.white,
    paddingTop: 56,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  greetingSection: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  greeting: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  userName: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  university: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  notifBtn: {
    padding: Spacing.sm,
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },

  /* Section */
  section: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
  },

  /* Quick Actions */
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    ...Typography.bodySmall,
    color: Colors.text,
    textAlign: 'center',
    fontWeight: '600',
  },

  /* Horizontal Scroll */
  horizontalScroll: {
    marginHorizontal: -Spacing.base,
    paddingHorizontal: Spacing.base,
  },
  freelancerCard: {
    width: 140,
    marginRight: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  freelancerHeader: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  freelancerName: {
    ...Typography.h4,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  freelancerRole: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 15,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  freelancerPrice: {
    ...Typography.h4,
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: '700',
  },

  /* Events */
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    ...Typography.h4,
    color: Colors.text,
    fontWeight: '700',
  },
  eventMeta: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  eventCommunity: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  eventRight: {
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  registeredTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  registeredText: {
    ...Typography.caption,
    color: Colors.success,
    fontWeight: '600',
  },

  /* Community Posts */
  communityPost: {
    flexDirection: 'row',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  communityIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityName: {
    ...Typography.label,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  postTitle: {
    ...Typography.h4,
    color: Colors.text,
    lineHeight: 18,
    fontWeight: '600',
  },
  postMeta: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
    alignItems: 'center',
  },
  postTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  postLikes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  postLikesText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
