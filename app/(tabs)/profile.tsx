import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { currentUser } from '@/data/mockData';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import Avatar from '@/components/ui/Avatar';
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';

function SettingRow({
  icon, label, value, onPress, hasChevron = true, color = Colors.primary,
}: {
  icon: string; label: string; value?: string; onPress?: () => void; hasChevron?: boolean; color?: string;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.settingRow} activeOpacity={0.7}>
      <View style={[styles.settingIcon, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
      {value && <Text style={styles.settingValue}>{value}</Text>}
      {hasChevron && <Ionicons name="chevron-forward" size={16} color={Colors.subtext} />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const [isFreelancer, setIsFreelancer] = useState(currentUser.isFreelancer);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#3730A3', '#4F46E5', '#7C3AED']} style={styles.header}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.profileRow}>
          <Avatar uri={currentUser.avatar} size={76} showBorder borderColor="rgba(255,255,255,0.5)" />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{currentUser.name}</Text>
            <Text style={styles.university}>{currentUser.university}</Text>
            <Text style={styles.year}>{currentUser.year}</Text>
            <Badge label={currentUser.role} variant="info" />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Orders', value: currentUser.completedOrders, icon: '✅' },
            { label: 'Earnings', value: `₹${(currentUser.earnings / 1000).toFixed(1)}k`, icon: '💰' },
            { label: 'Rating',  value: currentUser.rating.toFixed(1), icon: '⭐' },
            { label: 'Joined',  value: currentUser.joinedDate.split(' ')[1], icon: '📅' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Followers row */}
        <View style={styles.followRow}>
          <View style={styles.followItem}>
            <Text style={styles.followCount}>{currentUser.followers}</Text>
            <Text style={styles.followLabel}>Followers</Text>
          </View>
          <View style={styles.followDivider} />
          <View style={styles.followItem}>
            <Text style={styles.followCount}>{currentUser.following}</Text>
            <Text style={styles.followLabel}>Following</Text>
          </View>
          <View style={styles.followDivider} />
          <View style={styles.followItem}>
            <Text style={styles.followCount}>{currentUser.email.split('@')[1]}</Text>
            <Text style={styles.followLabel}>Domain</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        {/* Freelancer Toggle */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleLeft}>
            <Ionicons name="briefcase-outline" size={20} color={Colors.primary} />
            <View>
              <Text style={styles.toggleTitle}>Freelancer Mode</Text>
              <Text style={styles.toggleSub}>Offer your services on campus</Text>
            </View>
          </View>
          <Switch
            value={isFreelancer}
            onValueChange={setIsFreelancer}
            trackColor={{ false: Colors.border, true: Colors.primary + '60' }}
            thumbColor={isFreelancer ? Colors.primary : '#f4f3f4'}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.card}>
            <SettingRow
              icon="cash-outline"
              label="Earnings & Analytics"
              value="₹24.5k"
              onPress={() => router.push('/earnings')}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="notifications-outline"
              label="Notifications"
              onPress={() => router.push('/notifications')}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="add-circle-outline"
              label="Post a New Service"
              onPress={() => router.push('/post-service')}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="calendar-outline"
              label="Create an Event"
              onPress={() => router.push('/create-event')}
            />
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <SettingRow icon="person-outline" label="Edit Profile" onPress={() => {}} />
            <View style={styles.divider} />
            <SettingRow icon="school-outline" label="University" value={currentUser.university} onPress={() => {}} />
            <View style={styles.divider} />
            <SettingRow icon="lock-closed-outline" label="Change Password" onPress={() => {}} />
            <View style={styles.divider} />
            <SettingRow icon="shield-checkmark-outline" label="Privacy Settings" onPress={() => {}} />
          </View>
        </View>

        {/* Admin */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin</Text>
          <View style={styles.card}>
            <SettingRow
              icon="settings-outline"
              label="Admin Panel"
              color={Colors.warning}
              onPress={() => router.push('/admin')}
            />
          </View>
        </View>

        {/* Logout */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <View style={styles.card}>
            <SettingRow
              icon="log-out-outline"
              label="Log Out"
              color={Colors.error}
              hasChevron={false}
              onPress={() => {
                Alert.alert('Log Out', 'Are you sure you want to log out?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Log Out', style: 'destructive', onPress: () => router.replace('/(auth)/auth') },
                ]);
              }}
            />
          </View>
          <Text style={styles.version}>onlyStudents v1.0.0 · Made with 🧡 in India</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 56, paddingBottom: 24, paddingHorizontal: Spacing.base, overflow: 'hidden' },
  circle1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)', top: -60, right: -60,
  },
  circle2: {
    position: 'absolute', width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(236,72,153,0.1)', bottom: -40, left: -40,
  },
  profileRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-start', marginBottom: 20 },
  profileInfo: { flex: 1, paddingTop: 4, gap: 4 },
  name: { fontSize: 20, fontWeight: '800', color: '#fff' },
  university: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: '600' },
  year: { fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 4 },

  statsGrid: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  statCard: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12, padding: 10, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  statIcon: { fontSize: 14, marginBottom: 4 },
  statValue: { color: '#fff', fontSize: 15, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: '600', marginTop: 2 },

  followRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  followItem: { flex: 1, alignItems: 'center' },
  followCount: { color: '#fff', fontSize: 15, fontWeight: '700' },
  followLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 1 },
  followDivider: { width: 1, height: 26, backgroundColor: 'rgba(255,255,255,0.15)' },

  body: { padding: Spacing.base },
  toggleCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: BorderRadius.lg,
    padding: 16, marginBottom: 16, ...Shadows.md,
  },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  toggleTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  toggleSub: { fontSize: 12, color: Colors.subtext, marginTop: 1 },

  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.subtext, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { backgroundColor: '#fff', borderRadius: BorderRadius.lg, ...Shadows.sm, overflow: 'hidden' },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  settingIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.text },
  settingValue: { fontSize: 13, color: Colors.subtext, marginRight: 8 },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 64 },
  version: { textAlign: 'center', fontSize: 12, color: Colors.subtext, marginTop: 12 },
});
