import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart } from 'react-native-gifted-charts';
import { earningsData, recentOrders, currentUser } from '@/data/mockData';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

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
    label: d.month,
    frontColor: d.month === 'Mar' ? Colors.primary : Colors.primary + '80',
    topLabelComponent: () => (
      <Text style={{ fontSize: 9, color: Colors.subtext, marginBottom: 2 }}>
        {d.amount >= 1000 ? `${(d.amount / 1000).toFixed(1)}k` : d.amount}
      </Text>
    ),
  }));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Summary Banner */}
      <LinearGradient colors={['#3730A3', '#4F46E5', '#7C3AED']} style={styles.banner}>
        <View style={styles.circle1} />
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
            <Text style={styles.bStatVal}>{currentUser.rating.toFixed(1)} ⭐</Text>
            <Text style={styles.bStatLabel}>Avg Rating</Text>
          </View>
          <View style={styles.bStatDivider} />
          <View style={styles.bStat}>
            <Text style={[styles.bStatVal, { color: growth >= 0 ? '#86EFAC' : '#FCA5A5' }]}>
              {growth >= 0 ? '+' : ''}{growth}%
            </Text>
            <Text style={styles.bStatLabel}>vs Last Month</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        {/* Chart */}
        <Card style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Monthly Earnings</Text>
          <Text style={styles.chartSubtitle}>Last 6 months</Text>
          <View style={styles.chartWrapper}>
            <BarChart
              data={chartData}
              width={W - 80}
              height={180}
              barWidth={32}
              spacing={18}
              roundedTop
              roundedBottom={false}
              noOfSections={4}
              maxValue={9000}
              yAxisTextStyle={{ color: Colors.subtext, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: Colors.subtext, fontSize: 11, fontWeight: '600' }}
              xAxisColor={Colors.border}
              yAxisColor={Colors.border}
              hideRules={false}
              rulesColor={Colors.border}
              rulesType="solid"
              showGradient
              gradientColor={Colors.primary + '40'}
              activeOpacity={0.8}
            />
          </View>

          {/* Month labels */}
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
              <Text style={styles.legendText}>This month</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.primary + '80' }]} />
              <Text style={styles.legendText}>Previous months</Text>
            </View>
          </View>
        </Card>

        {/* Recent Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          {recentOrders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderLeft}>
                <View style={styles.orderIcon}>
                  <Text style={{ fontSize: 16 }}>📦</Text>
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
          <View style={styles.payoutRow}>
            <Text style={styles.payoutLabel}>Platform Commission</Text>
            <Text style={styles.payoutValue}>10%</Text>
          </View>
          <View style={styles.payoutRow}>
            <Text style={styles.payoutLabel}>Net Earnings (after commission)</Text>
            <Text style={[styles.payoutValue, { color: Colors.success }]}>
              ₹{Math.round(totalEarnings * 0.9).toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={styles.payoutRow}>
            <Text style={styles.payoutLabel}>Next Payout</Text>
            <Text style={styles.payoutValue}>March 31, 2025</Text>
          </View>
          <Text style={styles.payoutNote}>
            Payouts are processed every 15 days to your linked bank account.
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  banner: { paddingTop: 16, paddingBottom: 24, paddingHorizontal: Spacing.base, overflow: 'hidden' },
  circle1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)', top: -60, right: -60,
  },
  bannerLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600', marginBottom: 4 },
  bannerAmount: { color: '#fff', fontSize: 36, fontWeight: '900', marginBottom: 4, letterSpacing: -1 },
  bannerSub: { color: 'rgba(255,255,255,0.55)', fontSize: 12, marginBottom: 16 },
  bannerStats: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 12,
  },
  bStat: { flex: 1, alignItems: 'center' },
  bStatVal: { color: '#fff', fontSize: 16, fontWeight: '700' },
  bStatLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 10, marginTop: 2, textAlign: 'center' },
  bStatDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.15)' },

  body: { padding: Spacing.base },
  chartCard: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  chartSubtitle: { fontSize: 12, color: Colors.subtext, marginBottom: 16 },
  chartWrapper: { alignItems: 'center' },
  chartLegend: { flexDirection: 'row', gap: 16, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: Colors.subtext },

  section: { marginBottom: 16 },
  orderCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: BorderRadius.lg,
    padding: 14, marginBottom: 8, ...Shadows.sm,
  },
  orderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  orderIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.primary + '12', alignItems: 'center', justifyContent: 'center',
  },
  orderClient: { fontSize: 14, fontWeight: '700', color: Colors.text },
  orderService: { fontSize: 12, color: Colors.subtext, maxWidth: 160, marginTop: 1 },
  orderTime: { fontSize: 11, color: Colors.subtext, marginTop: 2 },
  orderRight: { alignItems: 'flex-end', gap: 4 },
  orderAmount: { fontSize: 15, fontWeight: '800', color: Colors.text },

  payoutCard: { marginBottom: 16 },
  payoutCardBottom: { marginBottom: 40 },
  payoutRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  payoutLabel: { fontSize: 14, color: Colors.subtext },
  payoutValue: { fontSize: 14, fontWeight: '700', color: Colors.text },
  payoutNote: { fontSize: 12, color: Colors.subtext, lineHeight: 17, marginTop: 8 },
});
