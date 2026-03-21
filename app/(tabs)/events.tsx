import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { events } from '@/data/mockData';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import Badge from '@/components/ui/Badge';

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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
        <Text style={styles.headerSub}>Discover what's happening on campus</Text>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          <View style={styles.filterRow}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setActiveFilter(f)}
                style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>🗓️</Text>
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
              <View style={[styles.cardHeader, { backgroundColor: event.communityColor + '15' }]}>
                <View style={[styles.cardEmoji, { backgroundColor: event.communityColor + '25' }]}>
                  <Text style={{ fontSize: 28 }}>{event.emoji}</Text>
                </View>
                <View style={styles.cardHeaderInfo}>
                  <Text style={[styles.communityLabel, { color: event.communityColor }]}>
                    {event.community}
                  </Text>
                  {event.prize && (
                    <View style={styles.prizeTag}>
                      <Text style={styles.prizeText}>🏆 {event.prize}</Text>
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
                    <Ionicons name="calendar-outline" size={13} color={Colors.subtext} />
                    <Text style={styles.metaText}>{event.date}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={13} color={Colors.subtext} />
                    <Text style={styles.metaText}>{event.time}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="location-outline" size={13} color={Colors.subtext} />
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
                    <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
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
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: '#fff', paddingTop: 56, paddingBottom: 16,
    paddingHorizontal: Spacing.base, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: Colors.text, marginBottom: 2 },
  headerSub: { fontSize: 13, color: Colors.subtext },
  filterRow: { flexDirection: 'row', gap: 8, paddingBottom: 2 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: '#fff',
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: Colors.subtext },
  filterTextActive: { color: '#fff' },
  list: { padding: Spacing.base, paddingBottom: 80 },
  empty: { alignItems: 'center', paddingTop: 40, gap: 8 },
  emptyText: { fontSize: 16, color: Colors.subtext },

  eventCard: {
    backgroundColor: '#fff', borderRadius: BorderRadius.xl,
    marginBottom: 14, overflow: 'hidden', ...Shadows.md,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 12,
  },
  cardEmoji: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  cardHeaderInfo: { flex: 1 },
  communityLabel: { fontSize: 12, fontWeight: '700', marginBottom: 2 },
  prizeTag: {
    backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 6, alignSelf: 'flex-start',
  },
  prizeText: { fontSize: 10, fontWeight: '600', color: '#92400E' },

  cardBody: { padding: 14, paddingTop: 10 },
  eventTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, marginBottom: 6 },
  eventDesc: { fontSize: 13, color: Colors.subtext, lineHeight: 18, marginBottom: 10 },

  metaList: { gap: 5, marginBottom: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: Colors.subtext, flex: 1 },

  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  tag: {
    backgroundColor: Colors.primary + '12', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  tagText: { fontSize: 11, fontWeight: '600', color: Colors.primary },

  capacityRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  capacityText: { fontSize: 12, color: Colors.subtext },
  capacityPct: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  capacityBar: {
    height: 5, backgroundColor: '#E5E7EB', borderRadius: 3, marginBottom: 10, overflow: 'hidden',
  },
  capacityFill: { height: '100%', borderRadius: 3 },

  registeredRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  registeredText: { fontSize: 12, color: Colors.success, fontWeight: '600' },
});
