import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BarChart } from 'react-native-gifted-charts';
import { currentUser, earningsData, recentOrders } from '@/data/mockData';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import Badge from '@/components/ui/Badge';

const SCREEN_WIDTH = Dimensions.get('window').width;

type RangeType = '3m' | '6m';

const STATUS_MAP: Record<string, 'pending' | 'in-progress' | 'completed'> = {
  pending: 'pending',
  'in-progress': 'in-progress',
  completed: 'completed',
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
      gap: Spacing.base,
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
      width: 94,
      height: 94,
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
    },
    heroMainAmountRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 6,
      marginBottom: Spacing.sm,
    },
    heroCurrency: {
      ...Typography.h3,
      color: Colors.text,
      fontWeight: '800',
      marginBottom: 2,
    },
    heroAmount: {
      ...Typography.hero,
      color: Colors.text,
    },
    heroMetaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.xs,
    },
    heroMetaPill: {
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      paddingHorizontal: 10,
      paddingVertical: 6,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    heroMetaText: {
      ...Typography.caption,
      color: Colors.text,
      fontWeight: '700',
    },
    kpiRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    kpiCard: {
      flex: 1,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      padding: Spacing.md,
      ...Shadows.sm,
    },
    kpiLabel: {
      ...Typography.caption,
      color: Colors.textSecondary,
      marginBottom: 3,
    },
    kpiValue: {
      ...Typography.h4,
      color: Colors.text,
      fontWeight: '800',
      marginBottom: 2,
    },
    kpiSub: {
      ...Typography.caption,
      color: Colors.textSecondary,
    },
    blockCard: {
      borderRadius: BorderRadius.xl,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      padding: Spacing.base,
      ...Shadows.sm,
    },
    blockHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    blockTitle: {
      ...Typography.h3,
      color: Colors.text,
    },
    blockSubTitle: {
      ...Typography.bodySmall,
      color: Colors.textSecondary,
      marginBottom: Spacing.md,
    },
    rangeSwitchWrap: {
      flexDirection: 'row',
      borderRadius: BorderRadius.full,
      backgroundColor: Colors.background,
      padding: 3,
    },
    rangeButton: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: BorderRadius.full,
    },
    rangeButtonActive: {
      backgroundColor: Colors.surface,
    },
    rangeButtonText: {
      ...Typography.caption,
      color: Colors.textSecondary,
      fontWeight: '700',
    },
    rangeButtonTextActive: {
      color: Colors.text,
    },
    blockActionText: {
      ...Typography.bodySmall,
      color: Colors.primary,
      fontWeight: '700',
    },
    orderRow: {
      borderTopWidth: 1,
      borderTopColor: Colors.border,
      paddingVertical: Spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    orderRowLast: {
      paddingBottom: 0,
    },
    orderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      flex: 1,
    },
    orderIconWrap: {
      width: 38,
      height: 38,
      borderRadius: BorderRadius.md,
      backgroundColor: Colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    orderTextWrap: {
      flex: 1,
    },
    orderClient: {
      ...Typography.body,
      color: Colors.text,
      fontWeight: '700',
    },
    orderService: {
      ...Typography.bodySmall,
      color: Colors.textSecondary,
      marginTop: 1,
    },
    orderTime: {
      ...Typography.caption,
      color: Colors.textSecondary,
      marginTop: 3,
    },
    orderRight: {
      alignItems: 'flex-end',
      gap: Spacing.xs,
    },
    orderAmount: {
      ...Typography.body,
      color: Colors.text,
      fontWeight: '800',
    },
    payoutCard: {
      gap: 0,
    },
    payoutRow: {
      borderTopWidth: 1,
      borderTopColor: Colors.border,
      paddingVertical: Spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    payoutRowLast: {
      borderTopWidth: 1,
      borderTopColor: Colors.border,
      paddingTop: Spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    payoutIcon: {
      width: 36,
      height: 36,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    payoutTextWrap: {
      flex: 1,
    },
    payoutLabel: {
      ...Typography.body,
      color: Colors.text,
      fontWeight: '700',
    },
    payoutSubText: {
      ...Typography.caption,
      color: Colors.textSecondary,
      marginTop: 1,
    },
    payoutValue: {
      ...Typography.body,
      color: Colors.text,
      fontWeight: '800',
    },
  });
};

export default function EarningsScreen() {
  const styles = getStyles();
  const [range, setRange] = useState<RangeType>('6m');

  const activeData = useMemo(
    () => (range === '3m' ? earningsData.slice(-3) : earningsData),
    [range],
  );

  const totalEarnings = useMemo(
    () => activeData.reduce((sum, item) => sum + item.amount, 0),
    [activeData],
  );

  const netEarnings = Math.round(totalEarnings * 0.9);

  const monthOverMonth = useMemo(() => {
    if (activeData.length < 2) return 0;
    const last = activeData[activeData.length - 1].amount;
    const prev = activeData[activeData.length - 2].amount;
    if (prev === 0) return 0;
    return Math.round(((last - prev) / prev) * 100);
  }, [activeData]);

  const chartData = useMemo(
    () =>
      activeData.map((item, index) => ({
        value: item.amount,
        label: item.month.slice(0, 3),
        frontColor: index === activeData.length - 1 ? Colors.primary : '#8FB5FF',
      })),
    [activeData],
  );

  const highestMonth = useMemo(
    () => activeData.reduce((max, item) => (item.amount > max.amount ? item : max), activeData[0]),
    [activeData],
  );

  const lastPayoutDate = 'Mar 31';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.heroCard}>
        <View style={styles.heroOrbA} />
        <View style={styles.heroOrbB} />

        <Text style={styles.heroEyebrow}>My Earnings</Text>
        <Text style={styles.heroTitle}>Track your money like a pro</Text>
        <Text style={styles.heroSubtitle}>View growth, orders, and payouts with a clean weekly workflow.</Text>

        <View style={styles.heroMainAmountRow}>
          <Text style={styles.heroCurrency}>Rs</Text>
          <Text style={styles.heroAmount}>{totalEarnings.toLocaleString('en-IN')}</Text>
        </View>

        <View style={styles.heroMetaRow}>
          <View style={styles.heroMetaPill}>
            <MaterialCommunityIcons
              name={monthOverMonth >= 0 ? 'trending-up' : 'trending-down'}
              size={14}
              color={monthOverMonth >= 0 ? Colors.success : Colors.error}
            />
            <Text
              style={[
                styles.heroMetaText,
                { color: monthOverMonth >= 0 ? Colors.success : Colors.error },
              ]}
            >
              {monthOverMonth >= 0 ? '+' : ''}
              {monthOverMonth}% vs last month
            </Text>
          </View>

          <View style={styles.heroMetaPill}>
            <MaterialCommunityIcons name="check-circle-outline" size={14} color={Colors.primaryDark} />
            <Text style={styles.heroMetaText}>{currentUser.completedOrders} completed orders</Text>
          </View>
        </View>
      </View>

      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Net earnings</Text>
          <Text style={styles.kpiValue}>Rs {netEarnings.toLocaleString('en-IN')}</Text>
          <Text style={styles.kpiSub}>After 10% platform fee</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Top month</Text>
          <Text style={styles.kpiValue}>{highestMonth.month}</Text>
          <Text style={styles.kpiSub}>Rs {highestMonth.amount.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      <View style={styles.blockCard}>
        <View style={styles.blockHeaderRow}>
          <Text style={styles.blockTitle}>Earnings trend</Text>
          <View style={styles.rangeSwitchWrap}>
            <TouchableOpacity
              style={[styles.rangeButton, range === '3m' && styles.rangeButtonActive]}
              activeOpacity={0.85}
              onPress={() => setRange('3m')}
            >
              <Text style={[styles.rangeButtonText, range === '3m' && styles.rangeButtonTextActive]}>3M</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.rangeButton, range === '6m' && styles.rangeButtonActive]}
              activeOpacity={0.85}
              onPress={() => setRange('6m')}
            >
              <Text style={[styles.rangeButtonText, range === '6m' && styles.rangeButtonTextActive]}>6M</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.blockSubTitle}>Performance over the selected range</Text>

        <BarChart
          data={chartData}
          width={SCREEN_WIDTH - 96}
          height={165}
          barWidth={22}
          spacing={14}
          roundedTop
          noOfSections={4}
          yAxisTextStyle={{ color: Colors.textSecondary, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: Colors.textSecondary, fontSize: 10, fontWeight: '600' }}
          xAxisColor="#D8E2F3"
          yAxisColor="#D8E2F3"
          hideRules={false}
          rulesColor="#E3EAF6"
          rulesType="solid"
          showGradient
          gradientColor="#BFD6FF"
        />
      </View>

      <View style={styles.blockCard}>
        <View style={styles.blockHeaderRow}>
          <Text style={styles.blockTitle}>Recent orders</Text>
          <Text style={styles.blockActionText}>View all</Text>
        </View>

        {recentOrders.map((order, index) => (
          <View key={order.id} style={[styles.orderRow, index === recentOrders.length - 1 && styles.orderRowLast]}>
            <View style={styles.orderLeft}>
              <View style={styles.orderIconWrap}>
                <MaterialCommunityIcons name="briefcase-variant-outline" size={18} color={Colors.primaryDark} />
              </View>
              <View style={styles.orderTextWrap}>
                <Text style={styles.orderClient}>{order.client}</Text>
                <Text style={styles.orderService} numberOfLines={1}>
                  {order.service}
                </Text>
                <Text style={styles.orderTime}>{order.time}</Text>
              </View>
            </View>

            <View style={styles.orderRight}>
              <Text style={styles.orderAmount}>Rs {order.amount}</Text>
              <Badge label={order.status} variant={STATUS_MAP[order.status]} />
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.blockCard, styles.payoutCard]}>
        <Text style={styles.blockTitle}>Payout details</Text>

        <View style={styles.payoutRow}>
          <View style={[styles.payoutIcon, { backgroundColor: '#FFF3E3' }]}>
            <MaterialCommunityIcons name="percent-outline" size={18} color={Colors.warning} />
          </View>
          <View style={styles.payoutTextWrap}>
            <Text style={styles.payoutLabel}>Platform fee</Text>
            <Text style={styles.payoutSubText}>10% charged from gross earnings</Text>
          </View>
          <Text style={styles.payoutValue}>10%</Text>
        </View>

        <View style={styles.payoutRow}>
          <View style={[styles.payoutIcon, { backgroundColor: '#EAF8F0' }]}>
            <MaterialCommunityIcons name="wallet-plus-outline" size={18} color={Colors.success} />
          </View>
          <View style={styles.payoutTextWrap}>
            <Text style={styles.payoutLabel}>Net amount</Text>
            <Text style={styles.payoutSubText}>Transferred to your payout account</Text>
          </View>
          <Text style={[styles.payoutValue, { color: Colors.success }]}>Rs {netEarnings.toLocaleString('en-IN')}</Text>
        </View>

        <View style={styles.payoutRowLast}>
          <View style={[styles.payoutIcon, { backgroundColor: '#E8F0FF' }]}>
            <MaterialCommunityIcons name="calendar-clock-outline" size={18} color={Colors.primaryDark} />
          </View>
          <View style={styles.payoutTextWrap}>
            <Text style={styles.payoutLabel}>Next payout</Text>
            <Text style={styles.payoutSubText}>Payout cycle every 15 days</Text>
          </View>
          <Text style={styles.payoutValue}>{lastPayoutDate}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
