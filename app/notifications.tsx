import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { notifications } from '@/data/mockData';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';

const TYPE_COLORS: Record<string, string> = {
  order:     '#4F46E5',
  community: '#7C3AED',
  event:     '#EC4899',
  review:    '#F59E0B',
  payment:   '#10B981',
};

export default function NotificationsScreen() {
  const unread = notifications.filter((n) => n.unread);
  const read = notifications.filter((n) => !n.unread);

  function NotifItem({ item }: { item: typeof notifications[0] }) {
    const color = TYPE_COLORS[item.type] || Colors.primary;
    return (
      <TouchableOpacity
        style={[styles.notifCard, item.unread && styles.notifUnread]}
        activeOpacity={0.85}
      >
        {item.unread && <View style={styles.unreadDot} />}
        <View style={[styles.iconBox, { backgroundColor: color + '18' }]}>
          <Text style={styles.icon}>{item.icon}</Text>
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
                  <Text style={styles.groupTitle}>🔴 Unread ({unread.length})</Text>
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
            <Text style={styles.emptyEmoji}>🔔</Text>
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing.base, paddingBottom: 40 },
  groupHeader: { marginBottom: 8, marginTop: 4 },
  groupTitle: { fontSize: 13, fontWeight: '700', color: Colors.subtext, textTransform: 'uppercase', letterSpacing: 0.5 },
  notifCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#fff', borderRadius: BorderRadius.lg,
    padding: 14, marginBottom: 8, ...Shadows.sm, position: 'relative',
  },
  notifUnread: {
    borderLeftWidth: 3, borderLeftColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  unreadDot: {
    position: 'absolute', top: 14, right: 14,
    width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary,
  },
  iconBox: {
    width: 44, height: 44, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  icon: { fontSize: 20 },
  notifContent: { flex: 1, paddingRight: 12 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 3 },
  notifBody: { fontSize: 13, color: Colors.subtext, lineHeight: 18, marginBottom: 6 },
  notifTime: { fontSize: 11, color: Colors.subtext, fontWeight: '500' },
  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 16, color: Colors.subtext },
});
