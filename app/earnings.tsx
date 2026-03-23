import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BarChart } from 'react-native-gifted-charts';
import { earningsData, recentOrders, currentUser } from '@/data/mockData';
import { Colors, BorderRadius, Spacing, Shadows, Typography } from '@/constants/theme';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import ScreenHeader from '@/components/ui/ScreenHeader';

const { width: W } = Dimensions.get('window');

const STATUS_MAP: Record<string, 'pending' | 'in-progress' | 'completed'> = {
  pending:     'pending',
  'in-progress': 'in-progress',
  completed:   'completed',
};

export default function EarningsScreen() {
  const totalEarnings = earningsData.reduce((sum, d) => sum + d.amount, 0);
  const lastMonth = earningsData[earningsData.length - 1].amount;
  const prevMonth = earningsData[earningsData.length - 2].amount;
  const growth = Math.round(((lastMonth - prevMonth) / prevMonth) * 100);

  const chartData = earningsData.map((d) => ({
    value: d.amount,
    label: d.month.slice(0, 3),
    frontColor: d.month === 'Mar' ? Colors.primary : Colors.primary + '60',
  }));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <ScreenHeader
        title="Earnings & Analytics"
        subtitle="Track your income and performance"
      />

      {/* Summary Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerLabel}>Total Earnings</Text>
        <Text style={styles.bannerAmount}>₹{totalEarnings.toLocaleString('en-IN')}</Text>
        <Text style={styles.bannerSub}>Since {currentUser.joinedDate}</Text>

        <View style={styles.bannerStats}>
          <View style={styles.bStat}>
            <Text style={styles.bStatVal}>{currentUser.completedOrders}</Text>
            <Text style={styles.bStatLabel}>Completed Orders</Text>
          </View>
          <View style={styles.bStatDivider} />
          <View style={styles.bStat}>
            <Text style={styles.bStatVal}>{currentUser.rating.toFixed(1)}</Text>
            <Text style={styles.bStatLabel}>Avg Rating</Text>
          </View>
          <View style={styles.bStatDivider} />
          <View style={styles.bStat}>
            <Text style={[styles.bStatVal, { color: growth >= 0 ? Colors.success : Colors.error }]}>
              {growth >= 0 ? '+' : ''}{growth}%
            </Text>
            <Text style={styles.bStatLabel}>vs Last Month</Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        {/* Chart */}
        <Card style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Earnings Trend</Text>
          <Text style={styles.chartSubtitle}>Last 6 months</Text>
          <BarChart
            data={chartData}
            width={W - 80}
            height={140}
            barWidth={20}
            spacing={12}
            roundedTop
            noOfSections={4}
            maxValue={9000}
            yAxisTextStyle={{ color: Colors.textSecondary, fontSize: 9 }}
            xAxisLabelTextStyle={{ color: Colors.textSecondary, fontSize: 10, fontWeight: '600' }}
            xAxisColor={Colors.border}
            yAxisColor={Colors.border}
            hideRules={false}
            rulesColor={Colors.border}
            rulesType="solid"
            showGradient
            gradientColor={Colors.primary + '30'}
            activeOpacity={0.8}
          />
        </Card>

        {/* Recent Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          {recentOrders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderLeft}>
                <View style={styles.orderIcon}>
                  <MaterialCommunityIcons name="briefcase-variant" size={20} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.orderClient}>{order.client}</Text>
                  <Text style={styles.orderService} numberOfLines={1}>{order.service}</Text>
                  <Text style={styles.orderTime}>{order.time}</Text>
                </View>
              </View>
              <View style={styles.orderRight}>
                <Text style={styles.orderAmount}>₹{order.amount}</Text>
                <Badge label={order.status} variant={STATUS_MAP[order.status]} />
              </View>
            </View>
          ))}
        </View>

        {/* Payout Info */}
        <Card style={styles.payoutCardBottom}>
          <Text style={styles.sectionTitle}>Payout Details</Text>
          <View style={styles.payoutContent}>
            <View style={styles.payoutRow}>
              <View style={[styles.payoutIconBox, { backgroundColor: Colors.warning + '15' }]}>
                <MaterialCommunityIcons name="percent" size={22} color={Colors.warning} />
              </View>
              <View style={styles.payoutTextBox}>
                <Text style={styles.payoutLabel}>Platform Fee</Text>
                <Text style={styles.payoutSubtext}>10% from total earnings</Text>
              </View>
              <Text style={styles.payoutHighlight}>-10%</Text>
            </View>

            <View style={styles.payoutRow}>
              <View style={[styles.payoutIconBox, { backgroundColor: Colors.success + '15' }]}>
                <MaterialCommunityIcons name="wallet-plus" size={22} color={Colors.success} />
              </View>
              <View style={styles.payoutTextBox}>
                <Text style={styles.sectionTitle}>Your Net Earnings</Text>
                <Text style={styles.payoutSubtext}>After all deductions</Text>
              </View>
              <Text style={[styles.payoutAmount, { color: Colors.success }]}>
                ₹{Math.round(totalEarnings * 0.9).toLocaleString('en-IN')}
              </Text>
            </View>

            <View style={styles.payoutRow}>
              <View style={[styles.payoutIconBox, { backgroundColor: Colors.primary + '15' }]}>
                <MaterialCommunityIcons name="calendar-check" size={22} color={Colors.primary} />
              </View>
              <View style={styles.payoutTextBox}>
                <Text style={styles.payoutLabel}>Next Payout</Text>
                <Text style={styles.payoutSubtext}>Transfers every 15 days</Text>
              </View>
              <Text style={styles.payoutValue}>Mar 31</Text>
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
  },
  banner: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  bannerLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  bannerAmount: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.sm,
    letterSpacing: -1,
  },
  bannerSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  bannerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  bStat: {
    flex: 1,
    alignItems: 'center',
  },
  bStatVal: {
    ...Typography.h4,
    color: Colors.text,
    fontWeight: '700',
  },
  bStatLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  bStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  body: {
    padding: Spacing.base,
  },
  chartCard: {
    marginBottom: Spacing.lg,
  },
  chartSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  summaryMonth: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  summaryAmount: {
    ...Typography.h3,
    color: Colors.primary,
    fontWeight: '700',
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  chartSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  orderIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderClient: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '700',
  },
  orderService: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    maxWidth: 160,
    marginTop: Spacing.xs,
  },
  orderTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  orderRight: {
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  orderAmount: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '800',
  },
  payoutCardBottom: {
    marginBottom: 100,
    backgroundColor: Colors.white,
    borderWidth: 0,
  },
  payoutContent: {
    marginTop: Spacing.md,
    gap: 0,
  },
  payoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.sm,
  },
  payoutIconBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  payoutTextBox: {
    flex: 1,
    gap: Spacing.xs,
  },
  payoutLabel: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '700',
  },
  payoutSubtext: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  payoutHighlight: {
    ...Typography.body,
    color: Colors.warning,
    fontWeight: '700',
  },
  payoutValue: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '700',
  },
  payoutAmount: {
    ...Typography.h3,
    fontWeight: '800',
  },
  payoutNote: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 17,
    fontStyle: 'italic',
  },
});
