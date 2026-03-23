import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { freelancers, communities, events } from '@/data/mockData';
import { Colors, BorderRadius, Spacing, Shadows, Typography } from '@/constants/theme';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import ScreenHeader from '@/components/ui/ScreenHeader';

type TabType = 'overview' | 'verifications' | 'flagged';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const pendingVerifications = freelancers.filter((f) => !f.isVerified);
  const verifiedFreelancers = freelancers.filter((f) => f.isVerified);

  const STATS = [
    { label: 'Total Users',         value: '1,284',  icon: 'account-multiple', color: Colors.primary },
    { label: 'Active Freelancers',  value: '342',    icon: 'briefcase-variant', color: '#7C3AED' },
    { label: 'Orders Today',        value: '47',     icon: 'package-variant', color: Colors.success },
    { label: 'Revenue Today',       value: '₹8.2k',  icon: 'wallet-plus', color: Colors.warning },
    { label: 'Events Active',       value: events.length.toString(), icon: 'calendar-check', color: Colors.error },
    { label: 'Communities',         value: communities.length.toString(), icon: 'account-group', color: Colors.primary + '80' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title="Admin Panel"
        subtitle="Platform Management"
      />

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['overview', 'verifications', 'flagged'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            activeOpacity={0.7}
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
                  <MaterialCommunityIcons name={stat.icon} size={24} color={stat.color} />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="lightning-bolt" size={18} color={Colors.warning} />
                <Text style={styles.sectionTitle}>Quick Actions</Text>
              </View>
              {[
                { icon: 'check-circle', label: 'Approve Pending Verifications', color: Colors.success },
                { icon: 'flag',         label: 'Review Flagged Content',        color: Colors.error },
                { icon: 'email',        label: 'Send Platform Announcement',    color: Colors.primary },
                { icon: 'chart-box',    label: 'View Full Analytics',           color: Colors.primary },
                { icon: 'download',     label: 'Export Reports (CSV)',          color: Colors.warning },
              ].map((action) => (
                <TouchableOpacity
                  key={action.label}
                  style={styles.actionRow}
                  onPress={() => Alert.alert('Admin Action', `"${action.label}" would open here.`)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                    <MaterialCommunityIcons name={action.icon} size={18} color={action.color} />
                  </View>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                  <MaterialCommunityIcons name="chevron-right" size={16} color={Colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </Card>

            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="chart-line" size={18} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Platform Health</Text>
              </View>
              {[
                { label: 'Order Completion Rate', value: '94.2%', color: Colors.success },
                { label: 'Avg Response Time',     value: '2.4 hrs', color: Colors.primary },
                { label: 'Dispute Rate',           value: '1.8%',  color: Colors.warning },
                { label: 'User Retention (30d)',  value: '78%',   color: Colors.success },
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
            {/* Pending Section */}
            <View style={styles.verifySectionHeader}>
              <View style={styles.verifyStatusIcon}>
                <MaterialCommunityIcons name="clock" size={20} color={Colors.warning} />
              </View>
              <View>
                <Text style={styles.verifyStatusTitle}>Pending Review</Text>
                <Text style={styles.verifyStatusSub}>{pendingVerifications.length} applications awaiting approval</Text>
              </View>
            </View>
            <View style={styles.verifyCardsContainer}>
              {pendingVerifications.length === 0 ? (
                <View style={styles.emptyVerify}>
                  <Text style={styles.emptyVerifyText}>No pending verifications</Text>
                </View>
              ) : (
                pendingVerifications.map((f, idx) => (
                  <View key={f.id} style={[styles.verifyCardModern, styles.verifyCardPending]}>
                    <View style={styles.verifyCardTop}>
                      <Avatar uri={f.avatar} size={56} />
                      <View style={styles.verifyInfoModern}>
                        <Text style={styles.verifyNameModern}>{f.name}</Text>
                        <Text style={styles.verifyRoleModern}>{f.role}</Text>
                        <Text style={styles.verifyUniModern}>{f.university}</Text>
                      </View>
                      <View style={styles.verifyNumberBadge}>
                        <Text style={styles.verifyNumberText}>{idx + 1}</Text>
                      </View>
                    </View>
                    <View style={styles.verifyActionButtons}>
                      <TouchableOpacity
                        style={[styles.verifyActionBtn, styles.verifyApproveBtn]}
                        onPress={() => Alert.alert('Verified', `${f.name} has been verified.`)}
                        activeOpacity={0.7}
                      >
                        <MaterialCommunityIcons name="check-circle" size={18} color={Colors.success} />
                        <Text style={styles.verifyActionBtnText}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.verifyActionBtn, styles.verifyRejectBtn]}
                        onPress={() => Alert.alert('Rejected', `${f.name}'s application was rejected.`)}
                        activeOpacity={0.7}
                      >
                        <MaterialCommunityIcons name="close-circle" size={18} color={Colors.error} />
                        <Text style={styles.verifyActionBtnText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>

            {/* Verified Section */}
            <View style={[styles.verifySectionHeader, { marginTop: Spacing.xxl }]}>
              <View style={styles.verifyStatusIconVerified}>
                <MaterialCommunityIcons name="check-decagram" size={20} color={Colors.success} />
              </View>
              <View>
                <Text style={styles.verifyStatusTitle}>Verified Freelancers</Text>
                <Text style={styles.verifyStatusSub}>{verifiedFreelancers.length} trusted professionals</Text>
              </View>
            </View>
            <View style={styles.verifyCardsContainer}>
              {verifiedFreelancers.map((f) => (
                <View key={f.id} style={[styles.verifyCardModern, styles.verifyCardVerifiedModern]}>
                  <View style={styles.verifyCardTop}>
                    <Avatar uri={f.avatar} size={56} />
                    <View style={styles.verifyInfoModern}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                        <Text style={styles.verifyNameModern}>{f.name}</Text>
                        <View style={styles.verifyVerifiedCheckmark}>
                          <MaterialCommunityIcons name="check" size={10} color="#fff" />
                        </View>
                      </View>
                      <Text style={styles.verifyRoleModern}>{f.role}</Text>
                      <View style={styles.verifyStatsRow}>
                        <View style={styles.verifyStatBadge}>
                          <MaterialCommunityIcons name="star" size={12} color={Colors.warning} />
                          <Text style={styles.verifyStatText}>{f.rating}</Text>
                        </View>
                        <Text style={styles.verifyStatDivider}>•</Text>
                        <View style={styles.verifyStatBadge}>
                          <MaterialCommunityIcons name="check-circle" size={12} color={Colors.success} />
                          <Text style={styles.verifyStatText}>{f.completedOrders} orders</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.verifyCardBottom}>
                    <Text style={styles.verifyCardBottomText}>{f.university}</Text>
                    <View style={styles.verifyResponsiveTime}>
                      <MaterialCommunityIcons name="clock-outline" size={12} color={Colors.textSecondary} />
                      <Text style={styles.verifyResponsiveTimeText}>{f.responseTime}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ── FLAGGED TAB ── */}
        {activeTab === 'flagged' && (
          <>
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <MaterialCommunityIcons name="check-circle" size={48} color={Colors.success} />
              </View>
              <Text style={styles.emptyTitle}>No Flagged Content</Text>
              <Text style={styles.emptySub}>
                All posts and services are clean. The platform auto-flags suspicious content.
              </Text>
            </View>

            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="shield-check" size={18} color={Colors.success} />
                <Text style={styles.sectionTitle}>Auto-Moderation Rules Active</Text>
              </View>
              {[
                'Spam detection (keyword filtering)',
                'Price manipulation alerts',
                'Duplicate service detection',
                'Inappropriate content filter',
                'Fake review detection',
              ].map((rule, i) => (
                <View key={i} style={styles.ruleRow}>
                  <MaterialCommunityIcons name="check-circle" size={14} color={Colors.success} />
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
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
    ...Shadows.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.white,
  },
  tabBadge: {
    color: Colors.error,
  },

  body: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    width: '31%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderLeftWidth: 3,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statValue: {
    ...Typography.h4,
    color: Colors.text,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },

  card: {
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  metricLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  metricValue: {
    ...Typography.h4,
    fontWeight: '700',
  },

  verifySectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  verifyStatusIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.warning + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyStatusIconVerified: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.success + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyStatusTitle: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '700',
  },
  verifyStatusSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  verifyCardsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  verifyCardModern: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  verifyCardPending: {
    backgroundColor: Colors.warning + '08',
  },
  verifyCardVerifiedModern: {
    backgroundColor: Colors.white,
  },
  verifyCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  verifyInfoModern: {
    flex: 1,
    gap: Spacing.xs,
  },
  verifyNameModern: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '700',
  },
  verifyRoleModern: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  verifyUniModern: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  verifyReadyText: {
    ...Typography.caption,
    color: Colors.success,
    fontWeight: '600',
  },
  verifyStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  verifyStatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  verifyStatText: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: '700',
  },
  verifyStatDivider: {
    ...Typography.caption,
    color: Colors.border,
  },
  verifyCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
  },
  verifyCardBottomText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  verifyResponsiveTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  verifyResponsiveTimeText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  verifyNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.warning + '20',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  verifyNumberText: {
    ...Typography.body,
    color: Colors.warning,
    fontWeight: '700',
  },
  verifyVerifiedCheckmark: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyActionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  verifyActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
  },
  verifyApproveBtn: {
    borderColor: Colors.success,
    backgroundColor: Colors.success + '10',
  },
  verifyRejectBtn: {
    borderColor: Colors.error,
    backgroundColor: Colors.error + '10',
  },
  verifyActionBtnText: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.text,
  },
  emptyVerify: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  emptyVerifyText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    marginBottom: Spacing.lg,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.success + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.h4,
    color: Colors.text,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  emptySub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  ruleText: {
    ...Typography.body,
    color: Colors.text,
  },
});
