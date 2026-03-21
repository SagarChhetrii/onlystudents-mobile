import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { freelancers, communities, events } from '@/data/mockData';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';

type TabType = 'overview' | 'verifications' | 'flagged';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const pendingVerifications = freelancers.filter((f) => !f.isVerified);
  const verifiedFreelancers = freelancers.filter((f) => f.isVerified);

  const STATS = [
    { label: 'Total Users',      value: '1,284',  icon: '👥', color: '#4F46E5' },
    { label: 'Active Freelancers', value: '342',  icon: '💼', color: '#7C3AED' },
    { label: 'Orders Today',     value: '47',     icon: '📦', color: '#10B981' },
    { label: 'Revenue Today',    value: '₹8.2k', icon: '💰', color: '#F59E0B' },
    { label: 'Events Active',    value: events.length.toString(), icon: '🎉', color: '#EC4899' },
    { label: 'Communities',      value: communities.length.toString(), icon: '🏛️', color: '#0EA5E9' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Admin Banner */}
      <View style={styles.banner}>
        <Ionicons name="shield-checkmark" size={28} color={Colors.warning} />
        <View>
          <Text style={styles.bannerTitle}>Admin Panel</Text>
          <Text style={styles.bannerSub}>onlyStudents · Platform Management</Text>
        </View>
        <View style={styles.bannerBadge}>
          <Text style={styles.bannerBadgeText}>Admin</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['overview', 'verifications', 'flagged'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'verifications' && pendingVerifications.length > 0 && (
                <Text style={styles.tabBadge}> ({pendingVerifications.length})</Text>
              )}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.body}>
        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <>
            <View style={styles.statsGrid}>
              {STATS.map((stat) => (
                <View key={stat.label} style={[styles.statCard, { borderLeftColor: stat.color }]}>
                  <Text style={styles.statIcon}>{stat.icon}</Text>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            <Card style={styles.card}>
              <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
              {[
                { icon: 'checkmark-circle-outline', label: 'Approve Pending Verifications', color: Colors.success },
                { icon: 'flag-outline',             label: 'Review Flagged Content',        color: Colors.error },
                { icon: 'mail-outline',             label: 'Send Platform Announcement',    color: Colors.primary },
                { icon: 'bar-chart-outline',        label: 'View Full Analytics',           color: Colors.secondary },
                { icon: 'download-outline',         label: 'Export Reports (CSV)',          color: Colors.warning },
              ].map((action) => (
                <TouchableOpacity
                  key={action.label}
                  style={styles.actionRow}
                  onPress={() => Alert.alert('Admin Action', `"${action.label}" would open here.`)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.color + '18' }]}>
                    <Ionicons name={action.icon as any} size={18} color={action.color} />
                  </View>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.subtext} />
                </TouchableOpacity>
              ))}
            </Card>

            <Card style={styles.card}>
              <Text style={styles.sectionTitle}>📊 Platform Health</Text>
              {[
                { label: 'Order Completion Rate', value: '94.2%', color: Colors.success },
                { label: 'Avg Response Time',     value: '2.4 hrs', color: Colors.primary },
                { label: 'Dispute Rate',           value: '1.8%',  color: Colors.warning },
                { label: 'User Retention (30d)',  value: '78%',   color: Colors.secondary },
              ].map((metric) => (
                <View key={metric.label} style={styles.metricRow}>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                  <Text style={[styles.metricValue, { color: metric.color }]}>{metric.value}</Text>
                </View>
              ))}
            </Card>
          </>
        )}

        {/* ── VERIFICATIONS TAB ── */}
        {activeTab === 'verifications' && (
          <>
            <Text style={styles.groupLabel}>
              ⏳ Pending Verification ({pendingVerifications.length})
            </Text>
            {pendingVerifications.map((f) => (
              <View key={f.id} style={styles.verifyCard}>
                <Avatar uri={f.avatar} size={48} />
                <View style={styles.verifyInfo}>
                  <Text style={styles.verifyName}>{f.name}</Text>
                  <Text style={styles.verifyRole}>{f.role}</Text>
                  <Text style={styles.verifyUni}>{f.university}</Text>
                </View>
                <View style={styles.verifyActions}>
                  <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => Alert.alert('✅ Verified', `${f.name} has been verified.`)}
                  >
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => Alert.alert('❌ Rejected', `${f.name}'s application was rejected.`)}
                  >
                    <Ionicons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <Text style={[styles.groupLabel, { marginTop: 16 }]}>
              ✅ Verified Freelancers ({verifiedFreelancers.length})
            </Text>
            {verifiedFreelancers.map((f) => (
              <View key={f.id} style={[styles.verifyCard, styles.verifyCardVerified]}>
                <Avatar uri={f.avatar} size={48} />
                <View style={styles.verifyInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.verifyName}>{f.name}</Text>
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark" size={8} color="#fff" />
                    </View>
                  </View>
                  <Text style={styles.verifyRole}>{f.role}</Text>
                </View>
                <Badge label="Verified" variant="verified" />
              </View>
            ))}
          </>
        )}

        {/* ── FLAGGED TAB ── */}
        {activeTab === 'flagged' && (
          <>
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 48 }}>🎉</Text>
              <Text style={styles.emptyTitle}>No Flagged Content</Text>
              <Text style={styles.emptySub}>
                All posts and services are clean. The platform auto-flags suspicious content.
              </Text>
            </View>

            <Card style={styles.card}>
              <Text style={styles.sectionTitle}>🛡️ Auto-Moderation Rules Active</Text>
              {[
                'Spam detection (keyword filtering)',
                'Price manipulation alerts',
                'Duplicate service detection',
                'Inappropriate content filter',
                'Fake review detection',
              ].map((rule, i) => (
                <View key={i} style={styles.ruleRow}>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                  <Text style={styles.ruleText}>{rule}</Text>
                </View>
              ))}
            </Card>
          </>
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  banner: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#FFFBEB', margin: 16, borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: '#FDE68A',
  },
  bannerTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },
  bannerSub: { fontSize: 12, color: Colors.subtext, marginTop: 2 },
  bannerBadge: {
    marginLeft: 'auto', backgroundColor: Colors.warning,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  bannerBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  tabs: {
    flexDirection: 'row', marginHorizontal: 16, marginBottom: 4,
    backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4,
  },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: 'center' },
  tabActive: { backgroundColor: '#fff', ...Shadows.sm },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.subtext },
  tabTextActive: { color: Colors.text },
  tabBadge: { color: Colors.error },

  body: { padding: Spacing.base },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  statCard: {
    width: '30.5%', backgroundColor: '#fff', borderRadius: 12,
    padding: 12, borderLeftWidth: 3, ...Shadows.sm,
  },
  statIcon: { fontSize: 18, marginBottom: 6 },
  statValue: { fontSize: 18, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 10, color: Colors.subtext, marginTop: 2 },

  card: { marginBottom: 14 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 14 },
  actionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  actionIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  actionLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.text },
  metricRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  metricLabel: { fontSize: 14, color: Colors.subtext },
  metricValue: { fontSize: 16, fontWeight: '800' },

  groupLabel: { fontSize: 13, fontWeight: '700', color: Colors.subtext, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  verifyCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: BorderRadius.lg,
    padding: 14, marginBottom: 8, ...Shadows.sm,
  },
  verifyCardVerified: { backgroundColor: '#ECFDF5' },
  verifyInfo: { flex: 1 },
  verifyName: { fontSize: 14, fontWeight: '700', color: Colors.text },
  verifyRole: { fontSize: 12, color: Colors.subtext, marginTop: 2 },
  verifyUni: { fontSize: 11, color: Colors.primary, fontWeight: '600', marginTop: 2 },
  verifyActions: { flexDirection: 'row', gap: 8 },
  approveBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center',
  },
  rejectBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.error, alignItems: 'center', justifyContent: 'center',
  },
  verifiedBadge: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center',
  },

  emptyState: { alignItems: 'center', padding: 28, marginBottom: 14 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginTop: 10 },
  emptySub: { fontSize: 14, color: Colors.subtext, textAlign: 'center', marginTop: 6, lineHeight: 20 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  ruleText: { fontSize: 14, color: Colors.text },
});
