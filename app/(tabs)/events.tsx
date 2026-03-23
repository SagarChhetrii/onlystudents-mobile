import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { events } from '@/data/mockData';
import { Colors, BorderRadius, Spacing, Shadows, Typography } from '@/constants/theme';
import Badge from '@/components/ui/Badge';
import ScreenHeader from '@/components/ui/ScreenHeader';

const FILTERS = ['All', 'Tech', 'Cultural', 'Startup', 'Photography'];

export default function EventsScreen() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = events.filter((e) => {
    if (activeFilter === 'All') return true;
    return e.tags.some((t) => t.toLowerCase().includes(activeFilter.toLowerCase()));
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title="Events"
        subtitle="Discover what's happening on campus"
      />

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons
                name="calendar-blank"
                size={48}
                color={Colors.textSecondary}
              />
            </View>
            <Text style={styles.emptyText}>No events found</Text>
          </View>
        }
        renderItem={({ item: event }) => {
          const pct = Math.round((event.registeredCount / event.maxCapacity) * 100);
          return (
            <TouchableOpacity
              onPress={() => router.push(`/events/${event.id}`)}
              activeOpacity={0.9}
              style={styles.eventCard}
            >
              {/* Header */}
              <View style={[styles.cardHeader, { backgroundColor: event.communityColor + '10' }]}>
                <View style={[styles.cardEmoji, { backgroundColor: event.communityColor + '20' }]}>
                  <MaterialCommunityIcons
                    name={event.emoji as any}
                    size={28}
                    color={event.communityColor}
                  />
                </View>
                <View style={styles.cardHeaderInfo}>
                  <Text style={[styles.communityLabel, { color: event.communityColor }]}>
                    {event.community}
                  </Text>
                  {event.prize && (
                    <View style={styles.prizeTag}>
                      <MaterialCommunityIcons
                        name="trophy"
                        size={12}
                        color="#92400E"
                        style={{ marginRight: Spacing.xs }}
                      />
                      <Text style={styles.prizeText}>{event.prize}</Text>
                    </View>
                  )}
                </View>
                <Badge label={event.isFree ? 'Free' : event.registrationFee || 'Paid'} variant={event.isFree ? 'free' : 'paid'} />
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDesc} numberOfLines={2}>{event.description}</Text>

                <View style={styles.metaList}>
                  <View style={styles.metaItem}>
                    <MaterialCommunityIcons name="calendar" size={14} color={Colors.textSecondary} />
                    <Text style={styles.metaText}>{event.date}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MaterialCommunityIcons name="clock-outline" size={14} color={Colors.textSecondary} />
                    <Text style={styles.metaText}>{event.time}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MaterialCommunityIcons name="map-marker" size={14} color={Colors.textSecondary} />
                    <Text style={styles.metaText} numberOfLines={1}>{event.location}</Text>
                  </View>
                </View>

                {/* Tags */}
                <View style={styles.tags}>
                  {event.tags.slice(0, 3).map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                {/* Capacity bar */}
                <View style={styles.capacityRow}>
                  <Text style={styles.capacityText}>
                    {event.registeredCount}/{event.maxCapacity} registered
                  </Text>
                  <Text style={styles.capacityPct}>{pct}%</Text>
                </View>
                <View style={styles.capacityBar}>
                  <View
                    style={[
                      styles.capacityFill,
                      {
                        width: `${pct}%` as any,
                        backgroundColor: pct > 80 ? Colors.warning : pct > 90 ? Colors.error : Colors.primary,
                      },
                    ]}
                  />
                </View>

                {event.isRegistered && (
                  <View style={styles.registeredRow}>
                    <MaterialCommunityIcons name="check-circle" size={14} color={Colors.success} />
                    <Text style={styles.registeredText}>You're registered!</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  filterScroll: {
    maxHeight: 60,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: Colors.white,
  },
  list: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: 100,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 100,
    gap: Spacing.lg,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...Typography.h3,
    color: Colors.text,
  },

  eventCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
  },
  cardEmoji: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderInfo: {
    flex: 1,
  },
  communityLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  prizeTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  prizeText: {
    ...Typography.caption,
    color: '#92400E',
    fontWeight: '600',
  },

  cardBody: {
    padding: Spacing.md,
    paddingTop: Spacing.md,
  },
  eventTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.sm,
    fontWeight: '700',
  },
  eventDesc: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },

  metaList: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metaText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
  },

  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tag: {
    backgroundColor: Colors.primary + '12',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },

  capacityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  capacityText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  capacityPct: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.primary,
  },
  capacityBar: {
    height: 5,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  capacityFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },

  registeredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  registeredText: {
    ...Typography.bodySmall,
    color: Colors.success,
    fontWeight: '600',
  },
});
