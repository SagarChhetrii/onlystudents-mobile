import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { events } from '@/data/mockData';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import PrimaryButton from '@/components/ui/PrimaryButton';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function EventDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = events.find((e) => e.id === id);
  const [isRegistered, setIsRegistered] = useState(event?.isRegistered ?? false);
  const [loading, setLoading] = useState(false);

  if (!event) {
    return (
      <View style={styles.notFound}>
        <Text>Event not found</Text>
      </View>
    );
  }

  const pct = Math.round((event.registeredCount / event.maxCapacity) * 100);
  const spotsLeft = event.maxCapacity - event.registeredCount;

  const handleRegister = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsRegistered(true);
      Alert.alert('🎉 Registered!', `You've successfully registered for ${event.title}`);
    }, 1200);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient colors={[event.communityColor, '#1E1B4B']} style={styles.hero}>
        <View style={styles.heroBg} />
        <View style={styles.heroContent}>
          <View style={[styles.emojiBox, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Text style={styles.emoji}>{event.emoji}</Text>
          </View>
          <Text style={styles.community}>{event.community}</Text>
          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.heroBadges}>
            <Badge label={event.isFree ? 'Free Entry' : event.registrationFee || 'Paid'} variant={event.isFree ? 'free' : 'paid'} size="md" />
            {event.prize && (
              <View style={styles.prizeBadge}>
                <Text style={styles.prizeText}>🏆 Prize: {event.prize}</Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        {/* Quick Info */}
        <Card style={styles.infoCard}>
          {[
            { icon: 'calendar-outline', label: 'Date', value: event.date },
            { icon: 'time-outline',     label: 'Time', value: event.time },
            { icon: 'location-outline', label: 'Location', value: event.location },
          ].map((item) => (
            <View key={item.label} style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name={item.icon as any} size={18} color={Colors.primary} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Description */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>About this Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </Card>

        {/* Tags */}
        <View style={styles.tags}>
          {event.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Capacity */}
        <Card style={styles.card}>
          <View style={styles.capacityHeader}>
            <Text style={styles.sectionTitle}>Registration</Text>
            <Text style={styles.spotsLeft}>
              {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full!'}
            </Text>
          </View>

          <View style={styles.capacityNumbers}>
            <Text style={styles.registeredCount}>{event.registeredCount}</Text>
            <Text style={styles.capacityDivider}>/</Text>
            <Text style={styles.maxCapacity}>{event.maxCapacity}</Text>
            <Text style={styles.capacityLabel}> registered</Text>
          </View>

          <View style={styles.barBg}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${pct}%` as any,
                  backgroundColor: pct > 90 ? Colors.error : pct > 75 ? Colors.warning : Colors.primary,
                },
              ]}
            />
          </View>
          <Text style={styles.pctText}>{pct}% capacity filled</Text>
        </Card>

        {/* Register Button */}
        <View style={styles.cta}>
          {isRegistered ? (
            <View style={styles.registeredBanner}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              <Text style={styles.registeredBannerText}>You're registered for this event!</Text>
            </View>
          ) : (
            <>
              <PrimaryButton
                title={event.isFree ? 'Register for Free →' : `Register for ${event.registrationFee} →`}
                onPress={handleRegister}
                loading={loading}
                disabled={spotsLeft === 0}
                fullWidth
                size="lg"
              />
              {!event.isFree && (
                <Text style={styles.feeNote}>Registration fee: {event.registrationFee}</Text>
              )}
            </>
          )}
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { paddingTop: 96, paddingBottom: 28 },
  heroBg: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  heroContent: { paddingHorizontal: Spacing.base, alignItems: 'center' },
  emojiBox: {
    width: 80, height: 80, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  emoji: { fontSize: 40 },
  community: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: 6 },
  title: {
    fontSize: 24, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 12, lineHeight: 30,
  },
  heroBadges: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  prizeBadge: {
    backgroundColor: 'rgba(245,158,11,0.25)',
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: 'rgba(245,158,11,0.4)',
  },
  prizeText: { fontSize: 13, fontWeight: '600', color: '#FEF3C7' },

  body: { padding: Spacing.base },
  card: { marginBottom: 14 },
  infoCard: { marginBottom: 14, gap: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoIconBox: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.primary + '12', alignItems: 'center', justifyContent: 'center',
  },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 11, color: Colors.subtext, fontWeight: '600', marginBottom: 2 },
  infoValue: { fontSize: 14, color: Colors.text, fontWeight: '600' },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 10 },
  description: { fontSize: 14, color: Colors.subtext, lineHeight: 21 },

  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  tag: {
    backgroundColor: Colors.primary + '14', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  tagText: { fontSize: 12, fontWeight: '600', color: Colors.primary },

  capacityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  spotsLeft: { fontSize: 13, fontWeight: '700', color: Colors.warning },
  capacityNumbers: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 },
  registeredCount: { fontSize: 28, fontWeight: '800', color: Colors.primary },
  capacityDivider: { fontSize: 20, color: Colors.subtext, marginHorizontal: 4 },
  maxCapacity: { fontSize: 20, fontWeight: '700', color: Colors.text },
  capacityLabel: { fontSize: 14, color: Colors.subtext },
  barBg: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  barFill: { height: '100%', borderRadius: 4 },
  pctText: { fontSize: 12, color: Colors.subtext },

  cta: { marginTop: 4, marginBottom: 16 },
  registeredBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.success + '12', borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: Colors.success + '30',
  },
  registeredBannerText: { fontSize: 14, fontWeight: '600', color: Colors.success },
  feeNote: { textAlign: 'center', fontSize: 13, color: Colors.textSecondary, marginTop: 8 },
});
