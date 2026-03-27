import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { notifications } from '@/data/mockData';
import { Colors, BorderRadius, Spacing, Shadows, Typography } from '@/constants/theme';
import ScreenHeader from '@/components/ui/ScreenHeader';

const TYPE_COLORS: Record<string, { bg: string; border: string; icon: string }> = {
  order:     { bg: Colors.primary + '10', border: Colors.primary, icon: '#2563EB' },
  community: { bg: '#7C3AED10', border: '#7C3AED', icon: '#7C3AED' },
  event:     { bg: Colors.warning + '10', border: Colors.warning, icon: Colors.warning },
  review:    { bg: Colors.success + '10', border: Colors.success, icon: Colors.success },
  payment:   { bg: Colors.primary + '10', border: Colors.primary, icon: Colors.primary },
};

export default function NotificationsScreen() {
  const unread = notifications.filter((n) => n.unread);
  const read = notifications.filter((n) => !n.unread);

  function NotifItem({ item }: { item: typeof notifications[0] }) {
    const colorConfig = TYPE_COLORS[item.type] || TYPE_COLORS.order;
    return (
      <TouchableOpacity
        style={[styles.notifCard, item.unread && styles.notifUnread]}
        activeOpacity={0.7}
      >
        {item.unread && <View style={styles.unreadDot} />}
        <View style={[styles.iconBox, { backgroundColor: colorConfig.bg }]}>
          <MaterialCommunityIcons name={item.icon as any} size={24} color={colorConfig.icon} />
        </View>
        <View style={styles.notifContent}>
          <Text style={styles.notifTitle}>{item.title}</Text>
          <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
          <Text style={styles.notifTime}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Notifications"
        subtitle={`${unread.length} new updates`}
      />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {unread.length > 0 && (
              <>
                <View style={styles.groupHeader}>
                  <MaterialCommunityIcons name="bell-ring" size={14} color={Colors.textSecondary} />
                  <Text style={styles.groupTitle}>Unread ({unread.length})</Text>
                </View>
                {unread.map((n) => <NotifItem key={n.id} item={n} />)}
                <View style={styles.groupHeader}>
                  <Text style={styles.groupTitle}>Earlier</Text>
                </View>
              </>
            )}
          </>
        }
        renderItem={({ item }) => item.unread ? null : <NotifItem item={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIconBox}>
              <MaterialCommunityIcons name="bell-off" size={48} color={Colors.textSecondary} />
            </View>
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>You're all caught up!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  list: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    paddingBottom: 60,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  groupTitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
    position: 'relative',
  },
  notifUnread: {
    backgroundColor: Colors.primary + '06',
    shadowColor: 'transparent',
    elevation: 0,
  },
  unreadDot: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifContent: {
    flex: 1,
    paddingRight: Spacing.xs,
    gap: Spacing.xs,
  },
  notifTitle: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '700',
  },
  notifBody: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  notifTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: Spacing.md,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...Typography.h4,
    color: Colors.text,
    fontWeight: '700',
  },
  emptySubtext: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
});
