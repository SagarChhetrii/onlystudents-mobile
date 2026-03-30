import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Avatar from '@/components/ui/Avatar';
import { chatThreads } from '@/data/mockData';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useAppMode } from '@/constants/appMode';

type FilterType = 'all' | 'unread' | 'active' | 'completed';

function formatPreviewTime(value: string) {
  return value;
}

export default function ChatsTabScreen() {
  const { isFreelancerMode } = useAppMode();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const decorated = useMemo(
    () =>
      chatThreads.map((thread) => {
        const latest = thread.messages[thread.messages.length - 1];
        const unreadCount = thread.messages.filter((msg) => !msg.isRead && msg.senderRole !== (isFreelancerMode ? 'freelancer' : 'client')).length;

        return {
          ...thread,
          latestMessage: latest,
          unreadCount,
          counterpartName: isFreelancerMode ? thread.clientName : thread.freelancerName,
          counterpartAvatar: isFreelancerMode ? thread.clientAvatar : thread.freelancerAvatar,
          counterpartRole: isFreelancerMode ? 'Client' : 'Freelancer',
        };
      }),
    [isFreelancerMode],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return decorated.filter((thread) => {
      if (filter === 'unread' && thread.unreadCount === 0) {
        return false;
      }
      if (filter === 'active' && thread.status !== 'in-progress' && thread.status !== 'inquiry') {
        return false;
      }
      if (filter === 'completed' && thread.status !== 'completed') {
        return false;
      }

      if (!q) {
        return true;
      }

      return (
        thread.counterpartName.toLowerCase().includes(q) ||
        thread.projectTitle.toLowerCase().includes(q) ||
        thread.latestMessage.text.toLowerCase().includes(q)
      );
    });
  }, [decorated, filter, query]);

  const heroTitle = isFreelancerMode ? 'Client Conversations' : 'Freelancer Conversations';
  const heroSub = isFreelancerMode
    ? 'Reply quickly to secure more bookings and keep projects moving.'
    : 'Discuss requirements, delivery timelines, and revisions in one place.';

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.heroCard}>
              <View style={styles.heroOrbA} />
              <View style={styles.heroOrbB} />

              <Text style={styles.heroEyebrow}>{isFreelancerMode ? 'Freelancer Mode' : 'Client Mode'}</Text>
              <Text style={styles.heroTitle}>{heroTitle}</Text>
              <Text style={styles.heroSub}>{heroSub}</Text>

              <View style={styles.heroStatsRow}>
                <View style={styles.heroStatPill}>
                  <Text style={styles.heroStatValue}>{decorated.length}</Text>
                  <Text style={styles.heroStatLabel}>Threads</Text>
                </View>
                <View style={styles.heroStatPill}>
                  <Text style={styles.heroStatValue}>{decorated.filter((item) => item.unreadCount > 0).length}</Text>
                  <Text style={styles.heroStatLabel}>Unread</Text>
                </View>
                <View style={styles.heroStatPill}>
                  <Text style={styles.heroStatValue}>{decorated.filter((item) => item.status === 'in-progress').length}</Text>
                  <Text style={styles.heroStatLabel}>In Progress</Text>
                </View>
              </View>
            </View>

            <View style={styles.searchRow}>
              <MaterialCommunityIcons name="magnify" size={18} color={Colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by person or project"
                placeholderTextColor={Colors.textSecondary}
                value={query}
                onChangeText={setQuery}
              />
              {query.length > 0 ? (
                <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.85}>
                  <MaterialCommunityIcons name="close-circle" size={18} color={Colors.textSecondary} />
                </TouchableOpacity>
              ) : null}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
              {[
                { id: 'all', label: 'All' },
                { id: 'unread', label: 'Unread' },
                { id: 'active', label: 'Active' },
                { id: 'completed', label: 'Completed' },
              ].map((item) => {
                const active = filter === (item.id as FilterType);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.filterChip, active && styles.filterChipActive]}
                    activeOpacity={0.85}
                    onPress={() => setFilter(item.id as FilterType)}
                  >
                    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>{filtered.length} conversations</Text>
              <Text style={styles.sectionSub}>Tap to open</Text>
            </View>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.threadCard}
            activeOpacity={0.86}
            onPress={() => router.push(`/chats/${item.id}`)}
          >
            <View style={styles.threadTopRow}>
              <Avatar uri={item.counterpartAvatar} size={48} />
              <View style={styles.threadTextWrap}>
                <View style={styles.threadNameRow}>
                  <Text style={styles.threadName} numberOfLines={1}>{item.counterpartName}</Text>
                  <Text style={styles.threadTime}>{formatPreviewTime(item.latestMessage.time)}</Text>
                </View>
                <Text style={styles.threadRole}>{item.counterpartRole} • {item.projectTitle}</Text>
                <Text style={styles.threadPreview} numberOfLines={1}>{item.latestMessage.text}</Text>
              </View>
            </View>

            <View style={styles.threadFooterRow}>
              <View style={[
                styles.statusPill,
                item.status === 'completed' ? styles.statusCompleted : styles.statusActive,
              ]}>
                <Text style={[
                  styles.statusText,
                  item.status === 'completed' ? styles.statusCompletedText : styles.statusActiveText,
                ]}>
                  {item.status === 'in-progress' ? 'In Progress' : item.status === 'inquiry' ? 'Inquiry' : 'Completed'}
                </Text>
              </View>

              {item.unreadCount > 0 ? (
                <View style={styles.unreadPill}>
                  <Text style={styles.unreadPillText}>{item.unreadCount}</Text>
                </View>
              ) : (
                <MaterialCommunityIcons name="check-all" size={16} color={Colors.textSecondary} />
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconWrap}>
              <MaterialCommunityIcons name="chat-processing-outline" size={34} color={Colors.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>No conversations found</Text>
            <Text style={styles.emptySub}>Try changing search or filter.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: 120,
  },
  heroCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  heroOrbA: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: Colors.primary,
    top: -56,
    right: -34,
    opacity: 0.3,
  },
  heroOrbB: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: Colors.primary,
    left: -24,
    bottom: -34,
    opacity: 0.2,
  },
  heroEyebrow: {
    ...Typography.label,
    color: Colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    ...Typography.h2,
    color: Colors.text,
    lineHeight: 30,
    marginBottom: Spacing.xs,
  },
  heroSub: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginBottom: Spacing.base,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  heroStatPill: {
    flex: 1,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  heroStatValue: {
    ...Typography.h4,
    color: Colors.text,
    fontWeight: '800',
  },
  heroStatLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  searchRow: {
    marginTop: Spacing.base,
    height: 46,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    padding: 0,
  },
  filterContent: {
    marginTop: Spacing.sm,
    gap: Spacing.sm,
    paddingRight: Spacing.base,
  },
  filterChip: {
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
  },
  filterChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  sectionHead: {
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  sectionSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  threadCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  threadTopRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  threadTextWrap: {
    flex: 1,
  },
  threadNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
    gap: Spacing.xs,
  },
  threadName: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '700',
    flex: 1,
  },
  threadTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  threadRole: {
    ...Typography.caption,
    color: Colors.primaryDark,
    marginBottom: 2,
    fontWeight: '700',
  },
  threadPreview: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  threadFooterRow: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPill: {
    borderRadius: BorderRadius.full,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  statusActive: {
    backgroundColor: Colors.infoLight,
  },
  statusCompleted: {
    backgroundColor: Colors.successLight,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '700',
  },
  statusActiveText: {
    color: Colors.info,
  },
  statusCompletedText: {
    color: Colors.success,
  },
  unreadPill: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadPillText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '800',
  },
  emptyCard: {
    marginTop: Spacing.base,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    paddingVertical: 44,
    paddingHorizontal: Spacing.base,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  emptySub: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
