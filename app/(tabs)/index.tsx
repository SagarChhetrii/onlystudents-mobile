import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { currentUser, freelancers, events, communities } from '@/data/mockData';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import StarRating from '@/components/ui/StarRating';
import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';

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
  const greeting = hour < 12 ? '☀️ Good Morning' : hour < 17 ? '👋 Hello' : '🌙 Good Evening';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#3730A3', '#4F46E5', '#7C3AED']} style={styles.header}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.userName}>{currentUser.name.split(' ')[0]} 🎓</Text>
            <Text style={styles.university}>{currentUser.university} · {currentUser.year}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={22} color="#fff" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
            <Avatar uri={currentUser.avatar} size={44} showBorder borderColor="rgba(255,255,255,0.5)" />
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Orders', value: currentUser.completedOrders, icon: '✅' },
            { label: 'Earnings', value: `₹${(currentUser.earnings / 1000).toFixed(1)}k`, icon: '💰' },
            { label: 'Rating', value: currentUser.rating.toFixed(1), icon: '⭐' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <AnimatedCard delay={100} style={styles.section}>
        <View style={styles.quickActions}>
          {[
            { icon: 'add-circle-outline', label: 'Post Service', color: '#4F46E5', route: '/post-service' },
            { icon: 'calendar-outline',   label: 'Create Event', color: '#EC4899', route: '/create-event' },
            { icon: 'search-outline',     label: 'Find Services', color: '#10B981', route: '/(tabs)/marketplace' },
            { icon: 'shield-checkmark-outline', label: 'Admin',  color: '#F59E0B', route: '/admin' },
          ].map((action) => (
            <TouchableOpacity
              key={action.label}
              onPress={() => router.push(action.route as any)}
              style={styles.quickAction}
              activeOpacity={0.8}
            >
              <View style={[styles.quickIcon, { backgroundColor: action.color + '18' }]}>
                <Ionicons name={action.icon as any} size={22} color={action.color} />
              </View>
              <Text style={styles.quickLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </AnimatedCard>

      {/* Featured Freelancers */}
      <AnimatedCard delay={200} style={styles.section}>
        <SectionHeader
          title="✨ Featured Freelancers"
          actionLabel="See all"
          onAction={() => router.push('/(tabs)/marketplace')}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {freelancers.map((freelancer) => (
            <TouchableOpacity
              key={freelancer.id}
              onPress={() => router.push(`/marketplace/${freelancer.id}`)}
              activeOpacity={0.9}
              style={styles.freelancerCard}
            >
              <Avatar uri={freelancer.avatar} size={56} />
              {freelancer.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Text style={{ fontSize: 10 }}>✓</Text>
                </View>
              )}
              <Text style={styles.freelancerName} numberOfLines={1}>{freelancer.name}</Text>
              <Text style={styles.freelancerRole} numberOfLines={2}>{freelancer.role}</Text>
              <StarRating rating={freelancer.rating} reviews={freelancer.reviews} size="sm" />
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
          title="🎉 Upcoming Events"
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
            <View style={[styles.eventEmoji, { backgroundColor: event.communityColor + '20' }]}>
              <Text style={{ fontSize: 22 }}>{event.emoji}</Text>
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
              <Text style={styles.eventMeta}>{event.date} · {event.location.split(',')[0]}</Text>
              <Text style={styles.eventCommunity}>{event.community}</Text>
            </View>
            <View style={styles.eventRight}>
              <Badge label={event.isFree ? 'Free' : event.registrationFee || 'Paid'} variant={event.isFree ? 'free' : 'paid'} />
              {event.isRegistered && <Text style={styles.registeredTag}>✓ Registered</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </AnimatedCard>

      {/* Community Highlights */}
      <AnimatedCard delay={400} style={[styles.section, { marginBottom: 100 }]}>
        <SectionHeader
          title="🏛️ Community Highlights"
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
              <View style={[styles.communityDot, { backgroundColor: item.community.color }]}>
                <Text style={{ fontSize: 16 }}>{item.community.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.communityName}>{item.community.name}</Text>
                <Text style={styles.postTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.postMeta}>
                  <Text style={styles.postTime}>{item.time}</Text>
                  <Text style={styles.postLikes}>❤️ {item.likes}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </AnimatedCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: 56, paddingBottom: 24, paddingHorizontal: Spacing.base, overflow: 'hidden',
  },
  circle1: {
    position: 'absolute', width: 240, height: 240, borderRadius: 120,
    backgroundColor: 'rgba(255,255,255,0.06)', top: -60, right: -60,
  },
  circle2: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(236,72,153,0.12)', bottom: -40, left: -40,
  },
  headerTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20,
  },
  greeting: { color: 'rgba(255,255,255,0.75)', fontSize: 14, fontWeight: '500' },
  userName: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 2 },
  university: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifBtn: { padding: 8, position: 'relative' },
  notifDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#EC4899', borderWidth: 1.5, borderColor: '#4F46E5',
  },

  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.md, padding: 12, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  statIcon: { fontSize: 18, marginBottom: 4 },
  statValue: { color: '#fff', fontSize: 17, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: '500', marginTop: 2 },

  section: { paddingHorizontal: Spacing.base, paddingTop: Spacing.lg },

  quickActions: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  quickAction: { flex: 1, alignItems: 'center', gap: 6 },
  quickIcon: {
    width: 52, height: 52, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  quickLabel: { fontSize: 11, fontWeight: '600', color: Colors.text, textAlign: 'center' },

  horizontalScroll: { marginHorizontal: -Spacing.base, paddingHorizontal: Spacing.base },
  freelancerCard: {
    width: 130, marginRight: 12, backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg, padding: 14,
    ...Shadows.md, position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute', top: 10, right: 10,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  freelancerName: { fontSize: 13, fontWeight: '700', color: Colors.text, marginTop: 8 },
  freelancerRole: { fontSize: 11, color: Colors.subtext, marginTop: 2, marginBottom: 6, lineHeight: 15 },
  freelancerPrice: { fontSize: 12, fontWeight: '700', color: Colors.primary, marginTop: 6 },

  eventRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
    padding: 14, marginBottom: 10, ...Shadows.sm,
  },
  eventEmoji: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  eventMeta: { fontSize: 12, color: Colors.subtext, marginTop: 2 },
  eventCommunity: { fontSize: 11, color: Colors.primary, fontWeight: '600', marginTop: 2 },
  eventRight: { alignItems: 'flex-end', gap: 4 },
  registeredTag: { fontSize: 10, color: Colors.success, fontWeight: '600' },

  communityPost: {
    flexDirection: 'row', gap: 12,
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
    padding: 14, marginBottom: 10, ...Shadows.sm,
  },
  communityDot: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  communityName: { fontSize: 11, fontWeight: '700', color: Colors.primary, marginBottom: 2 },
  postTitle: { fontSize: 13, fontWeight: '600', color: Colors.text, lineHeight: 18 },
  postMeta: { flexDirection: 'row', gap: 12, marginTop: 4 },
  postTime: { fontSize: 11, color: Colors.subtext },
  postLikes: { fontSize: 11, color: Colors.subtext },
});
