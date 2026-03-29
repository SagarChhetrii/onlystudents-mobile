import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { notifications } from '@/data/mockData';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';

type NotificationType = (typeof notifications)[number]['type'];
type FilterType = 'all' | 'unread' | 'payments' | 'community';

type NotificationState = {
  id: string;
  unread: boolean;
};

const TYPE_CONFIG: Record<NotificationType, { iconColor: string; pillBg: string; label: string }> = {
  order: {
    iconColor: '#1D4ED8',
    pillBg: '#E8F0FF',
    label: 'Order',
  },
  community: {
    iconColor: '#7E22CE',
    pillBg: '#F2E8FF',
    label: 'Community',
  },
  event: {
    iconColor: '#B45309',
    pillBg: '#FFF3E3',
    label: 'Event',
  },
  review: {
    iconColor: '#0F766E',
    pillBg: '#E6F8F4',
    label: 'Review',
  },
  payment: {
    iconColor: '#0369A1',
    pillBg: '#E8F7FF',
    label: 'Payment',
  },
};
const getStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    content: {
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
    heroSubtitle: {
      ...Typography.body,
      color: Colors.textSecondary,
      lineHeight: 21,
      marginBottom: Spacing.base,
      maxWidth: '95%',
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
    controlRow: {
      marginTop: Spacing.base,
      gap: Spacing.sm,
    },
    filterContent: {
      gap: Spacing.sm,
      paddingRight: Spacing.base,
    },
    filterChip: {
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.background,
      paddingHorizontal: Spacing.md,
      paddingVertical: 8,
    },
    filterChipActive: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
    },
    filterChipText: {
      ...Typography.bodySmall,
      color: Colors.textSecondary,
      fontWeight: '700',
    },
    filterChipTextActive: {
      color: Colors.white,
    },
    markAllButton: {
      alignSelf: 'flex-start',
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.primaryLight,
      paddingHorizontal: Spacing.md,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    markAllButtonDisabled: {
      backgroundColor: Colors.background,
      borderColor: Colors.border,
    },
    markAllText: {
      ...Typography.bodySmall,
      color: Colors.primaryDark,
      fontWeight: '700',
    },
    markAllTextDisabled: {
      color: Colors.textSecondary,
    },
    sectionHeaderRow: {
      marginTop: Spacing.base,
      marginBottom: Spacing.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sectionTitle: {
      ...Typography.h3,
      color: Colors.text,
    },
    sectionSubTitle: {
      ...Typography.bodySmall,
      color: Colors.textSecondary,
      textTransform: 'capitalize',
    },
    notificationCard: {
      borderRadius: BorderRadius.xl,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      padding: Spacing.md,
      flexDirection: 'row',
      gap: Spacing.sm,
      ...Shadows.sm,
      marginBottom: Spacing.sm,
    },
    notificationCardUnread: {
      borderColor: Colors.border,
      backgroundColor: Colors.primaryLight,
    },
    notificationIconWrap: {
      width: 46,
      height: 46,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationTextWrap: {
      flex: 1,
    },
    notificationTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.xs,
      marginBottom: 2,
    },
    notificationTitle: {
      ...Typography.body,
      color: Colors.text,
      fontWeight: '700',
      flex: 1,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors.primary,
    },
    notificationBody: {
      ...Typography.bodySmall,
      color: Colors.textSecondary,
      lineHeight: 19,
      marginBottom: Spacing.sm,
    },
    notificationBottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      flexWrap: 'wrap',
    },
    typePill: {
      borderRadius: BorderRadius.full,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    typePillText: {
      ...Typography.caption,
      fontWeight: '700',
    },
    notificationTime: {
      ...Typography.caption,
      color: Colors.textSecondary,
    },
    markReadButton: {
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.primaryLight,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    markReadText: {
      ...Typography.caption,
      color: Colors.primaryDark,
      fontWeight: '700',
    },
    emptyCard: {
      marginTop: Spacing.sm,
      borderRadius: BorderRadius.xl,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      alignItems: 'center',
      paddingVertical: 44,
      paddingHorizontal: Spacing.base,
      ...Shadows.sm,
    },
    emptyIconWrap: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: Colors.successLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.md,
    },
    emptyTitle: {
      ...Typography.h3,
      color: Colors.text,
      marginBottom: Spacing.xs,
    },
    emptySubTitle: {
      ...Typography.body,
      color: Colors.textSecondary,
      textAlign: 'center',
    },
  });
};
function NotificationCard({
  item,
  unread,
  onMarkRead,
  styles,
}: {
  item: (typeof notifications)[number];
  unread: boolean;
  onMarkRead: () => void;
  styles: ReturnType<typeof getStyles>;
}) {
  const tone = TYPE_CONFIG[item.type] || TYPE_CONFIG.order;

  return (
    <View style={[styles.notificationCard, unread && styles.notificationCardUnread]}>
      <View style={[styles.notificationIconWrap, { backgroundColor: tone.pillBg }]}>
        <MaterialCommunityIcons name={item.icon as any} size={22} color={tone.iconColor} />
      </View>

      <View style={styles.notificationTextWrap}>
        <View style={styles.notificationTopRow}>
          <Text style={styles.notificationTitle} numberOfLines={1}>
            {item.title}
          </Text>
          {unread ? <View style={styles.unreadDot} /> : null}
        </View>

        <Text style={styles.notificationBody} numberOfLines={2}>
          {item.body}
        </Text>

        <View style={styles.notificationBottomRow}>
          <View style={[styles.typePill, { backgroundColor: tone.pillBg }]}>
            <Text style={[styles.typePillText, { color: tone.iconColor }]}>{tone.label}</Text>
          </View>
          <Text style={styles.notificationTime}>{item.time}</Text>
          {unread ? (
            <TouchableOpacity style={styles.markReadButton} onPress={onMarkRead} activeOpacity={0.85}>
              <Text style={styles.markReadText}>Mark read</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default function NotificationsScreen() {
  const styles = getStyles();
  const [filter, setFilter] = useState<FilterType>('all');
  const [state, setState] = useState<NotificationState[]>(
    notifications.map((item) => ({ id: item.id, unread: item.unread })),
  );

  const data = useMemo(
    () =>
      notifications.map((item) => {
        const live = state.find((entry) => entry.id === item.id);
        return {
          ...item,
          unread: live ? live.unread : item.unread,
        };
      }),
    [state],
  );

  const unreadCount = useMemo(() => data.filter((item) => item.unread).length, [data]);

  const filteredData = useMemo(() => {
    if (filter === 'unread') {
      return data.filter((item) => item.unread);
    }

    if (filter === 'payments') {
      return data.filter((item) => item.type === 'payment' || item.type === 'order');
    }

    if (filter === 'community') {
      return data.filter((item) => item.type === 'community' || item.type === 'event');
    }

    return data;
  }, [data, filter]);

  const markRead = (id: string) => {
    setState((prev) => prev.map((item) => (item.id === id ? { ...item, unread: false } : item)));
  };

  const markAllRead = () => {
    setState((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.heroCard}>
        <View style={styles.heroOrbA} />
        <View style={styles.heroOrbB} />

        <Text style={styles.heroEyebrow}>Inbox</Text>
        <Text style={styles.heroTitle}>Notifications</Text>
        <Text style={styles.heroSubtitle}>Track orders, events, payouts, and updates in one clean timeline.</Text>

        <View style={styles.heroStatsRow}>
          <View style={styles.heroStatPill}>
            <Text style={styles.heroStatValue}>{unreadCount}</Text>
            <Text style={styles.heroStatLabel}>Unread</Text>
          </View>
          <View style={styles.heroStatPill}>
            <Text style={styles.heroStatValue}>{data.length}</Text>
            <Text style={styles.heroStatLabel}>Total</Text>
          </View>
          <View style={styles.heroStatPill}>
            <Text style={styles.heroStatValue}>{data.length - unreadCount}</Text>
            <Text style={styles.heroStatLabel}>Read</Text>
          </View>
        </View>
      </View>

      <View style={styles.controlRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'payments', label: 'Payments' },
            { id: 'community', label: 'Community' },
          ].map((item) => {
            const active = filter === (item.id as FilterType);
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setFilter(item.id as FilterType)}
                activeOpacity={0.85}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          onPress={markAllRead}
          activeOpacity={0.85}
          style={[styles.markAllButton, unreadCount === 0 && styles.markAllButtonDisabled]}
          disabled={unreadCount === 0}
        >
          <MaterialCommunityIcons name="check-all" size={14} color={unreadCount === 0 ? '#8A98B2' : Colors.primaryDark} />
          <Text style={[styles.markAllText, unreadCount === 0 && styles.markAllTextDisabled]}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>{filteredData.length} notifications</Text>
        <Text style={styles.sectionSubTitle}>{filter === 'all' ? 'All updates' : filter}</Text>
      </View>

      {filteredData.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <MaterialCommunityIcons name="bell-check-outline" size={34} color={Colors.success} />
          </View>
          <Text style={styles.emptyTitle}>All caught up</Text>
          <Text style={styles.emptySubTitle}>No notifications in this filter right now.</Text>
        </View>
      ) : (
        filteredData.map((item) => (
          <NotificationCard
            key={item.id}
            item={item}
            unread={item.unread}
            onMarkRead={() => markRead(item.id)}
            styles={styles}
          />
        ))
      )}
    </ScrollView>
  );
}
