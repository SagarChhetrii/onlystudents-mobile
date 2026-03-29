import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { events } from '@/data/mockData';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import PrimaryButton from '@/components/ui/PrimaryButton';

function getCapacityPercent(registeredCount: number, maxCapacity: number) {
  if (maxCapacity === 0) {
    return 0;
  }
  return Math.min(100, Math.round((registeredCount / maxCapacity) * 100));
}

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = events.find((entry) => entry.id === id);

  const [isRegistered, setIsRegistered] = useState(event?.isRegistered ?? false);
  const [loading, setLoading] = useState(false);

  if (!event) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Event not found</Text>
      </View>
    );
  }

  const registrationCount = isRegistered && !event.isRegistered
    ? event.registeredCount + 1
    : event.registeredCount;

  const spotsLeft = Math.max(0, event.maxCapacity - registrationCount);
  const capacityPercent = getCapacityPercent(registrationCount, event.maxCapacity);

  const pricingLabel = event.isFree ? 'Free Entry' : event.registrationFee || 'Paid';

  const handleRegister = () => {
    if (spotsLeft === 0 || isRegistered || loading) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsRegistered(true);
      Alert.alert('Registration successful', `You are now registered for ${event.title}.`);
    }, 1100);
  };

  const ctaTitle = useMemo(() => {
    if (isRegistered) {
      return 'You are registered';
    }

    if (spotsLeft === 0) {
      return 'Event is full';
    }

    if (event.isFree) {
      return 'Register for free';
    }

    return `Register for ${event.registrationFee}`;
  }, [event.isFree, event.registrationFee, isRegistered, spotsLeft]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[event.communityColor, '#0F2B6B']} style={styles.hero}>
        <View style={styles.heroOverlay} />

        <View style={styles.heroBadgeRow}>
          <View style={styles.topBadge}>
            <MaterialCommunityIcons name="account-group-outline" size={13} color={Colors.white} />
            <Text style={styles.topBadgeText} numberOfLines={1}>
              {event.community}
            </Text>
          </View>
          <View style={styles.topBadge}>
            <MaterialCommunityIcons
              name={event.isFree ? 'ticket-confirmation-outline' : 'cash-multiple'}
              size={13}
              color={Colors.white}
            />
            <Text style={styles.topBadgeText}>{pricingLabel}</Text>
          </View>
        </View>

        <View style={styles.heroIconWrap}>
          <MaterialCommunityIcons name={event.emoji as any} size={42} color={Colors.white} />
        </View>

        <Text style={styles.heroTitle}>{event.title}</Text>
        <Text style={styles.heroSubtitle}>{event.description}</Text>

        <View style={styles.heroMetaRow}>
          <View style={styles.heroMetaPill}>
            <MaterialCommunityIcons name="calendar-blank-outline" size={14} color={Colors.white} />
            <Text style={styles.heroMetaText}>{event.date}</Text>
          </View>
          <View style={styles.heroMetaPill}>
            <MaterialCommunityIcons name="clock-time-four-outline" size={14} color={Colors.white} />
            <Text style={styles.heroMetaText}>{event.time}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Event details</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <MaterialCommunityIcons name="map-marker-outline" size={16} color={Colors.primaryDark} />
            </View>
            <View style={styles.infoTextBlock}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{event.location}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <MaterialCommunityIcons name="account-group-outline" size={16} color={Colors.primaryDark} />
            </View>
            <View style={styles.infoTextBlock}>
              <Text style={styles.infoLabel}>Attendance</Text>
              <Text style={styles.infoValue}>
                {registrationCount} registered out of {event.maxCapacity}
              </Text>
            </View>
          </View>

          {event.prize ? (
            <View style={styles.prizeRow}>
              <MaterialCommunityIcons name="trophy-outline" size={16} color="#855700" />
              <Text style={styles.prizeText}>Prize: {event.prize}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.tagSection}>
          {event.tags.map((tag) => (
            <View key={tag} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.capacityCard}>
          <View style={styles.capacityHeader}>
            <Text style={styles.sectionTitle}>Seat availability</Text>
            <Text style={styles.spotsText}>
              {spotsLeft > 0 ? `${spotsLeft} seats left` : 'No seats left'}
            </Text>
          </View>

          <View style={styles.capacityTrack}>
            <View
              style={[
                styles.capacityFill,
                {
                  width: `${capacityPercent}%` as any,
                  backgroundColor:
                    capacityPercent >= 90
                      ? Colors.error
                      : capacityPercent >= 75
                        ? Colors.warning
                        : Colors.primary,
                },
              ]}
            />
          </View>

          <Text style={styles.capacityCaption}>{capacityPercent}% of seats filled</Text>
        </View>

        <View style={styles.ctaSection}>
          {isRegistered ? (
            <View style={styles.registeredBanner}>
              <MaterialCommunityIcons name="check-circle" size={20} color={Colors.success} />
              <Text style={styles.registeredBannerText}>You are registered for this event.</Text>
            </View>
          ) : null}

          <PrimaryButton
            title={ctaTitle}
            onPress={handleRegister}
            loading={loading}
            disabled={spotsLeft === 0 || isRegistered}
            size="lg"
            fullWidth
          />

          {!event.isFree ? (
            <Text style={styles.feeNote}>Registration fee applies at checkout: {event.registrationFee}</Text>
          ) : null}

          {spotsLeft === 0 && !isRegistered ? (
            <TouchableOpacity activeOpacity={0.85} style={styles.waitlistButton}>
              <Text style={styles.waitlistText}>Join waitlist</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },

  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F7FC',
  },

  notFoundText: {
    ...Typography.h3,
    color: Colors.text,
  },

  hero: {
    paddingTop: 88,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.base,
    overflow: 'hidden',
  },

  heroOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },

  heroBadgeRow: {
    zIndex: 2,
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
    flexWrap: 'wrap',
  },

  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxWidth: '100%',
  },

  topBadgeText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
    maxWidth: 220,
  },

  heroIconWrap: {
    zIndex: 2,
    width: 88,
    height: 88,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: Spacing.base,
  },

  heroTitle: {
    ...Typography.h1,
    zIndex: 2,
    color: Colors.white,
    lineHeight: 36,
    marginBottom: Spacing.sm,
  },

  heroSubtitle: {
    ...Typography.body,
    zIndex: 2,
    color: 'rgba(255,255,255,0.86)',
    lineHeight: 22,
    marginBottom: Spacing.base,
  },

  heroMetaRow: {
    zIndex: 2,
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },

  heroMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  heroMetaText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
  },

  content: {
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.base,
    gap: Spacing.base,
  },

  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: '#DEE6F3',
    padding: Spacing.base,
    ...Shadows.md,
  },

  sectionTitle: {
    ...Typography.h3,
    color: '#132649',
    marginBottom: Spacing.md,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },

  infoIconWrap: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    backgroundColor: '#ECF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoTextBlock: {
    flex: 1,
  },

  infoLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },

  infoValue: {
    ...Typography.body,
    color: '#2D3F5F',
    fontWeight: '600',
    marginTop: 2,
  },

  prizeRow: {
    marginTop: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FFF2DE',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  prizeText: {
    ...Typography.caption,
    color: '#7B5000',
    fontWeight: '700',
  },

  tagSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },

  tagChip: {
    borderRadius: BorderRadius.full,
    backgroundColor: '#EAF0FC',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  tagText: {
    ...Typography.caption,
    color: '#2D4A86',
    fontWeight: '700',
  },

  capacityCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: '#DEE6F3',
    padding: Spacing.base,
    ...Shadows.md,
  },

  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  spotsText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '700',
  },

  capacityTrack: {
    height: 9,
    borderRadius: 5,
    backgroundColor: '#DFE6F2',
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },

  capacityFill: {
    height: '100%',
    borderRadius: 5,
  },

  capacityCaption: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },

  ctaSection: {
    gap: Spacing.sm,
  },

  registeredBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#EAF8F0',
    borderWidth: 1,
    borderColor: '#BFE8D0',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },

  registeredBannerText: {
    ...Typography.body,
    color: Colors.success,
    fontWeight: '700',
  },

  feeNote: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  waitlistButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: Spacing.base,
  },

  waitlistText: {
    ...Typography.body,
    color: Colors.primaryDark,
    fontWeight: '700',
  },

  bottomSpacer: {
    height: 44,
  },
});
